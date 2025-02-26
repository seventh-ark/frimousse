"use client";

import {
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  Fragment,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
  type UIEvent,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EMOJI_FONT_FAMILY } from "../constants";
import { getEmojiData } from "../data/emoji";
import { getEmojiPickerData } from "../data/emoji-picker";
import { useActiveEmoji, useSkinTone } from "../hooks";
import {
  $activeEmoji,
  $categoriesRowsStartIndices,
  $isEmpty,
  $isLoading,
  $rowsCount,
  $search,
  $skinTones,
  type EmojiPickerStore,
  EmojiPickerStoreProvider,
  createEmojiPickerStore,
  sameEmojiPickerRow,
  useEmojiPickerStore,
} from "../store";
import type {
  EmojiData,
  EmojiPickerActiveEmojiProps,
  EmojiPickerCategory,
  EmojiPickerEmoji,
  EmojiPickerEmptyProps,
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListComponents,
  EmojiPickerListEmojiProps,
  EmojiPickerListProps,
  EmojiPickerListRowProps,
  EmojiPickerLoadingProps,
  EmojiPickerRootProps,
  EmojiPickerSearchProps,
  EmojiPickerSkinToneProps,
  EmojiPickerSkinToneSelectorProps,
  EmojiPickerViewportProps,
  WithAttributes,
} from "../types";
import { shallow } from "../utils/compare";
import { noop } from "../utils/noop";
import { requestIdleCallback } from "../utils/request-idle-callback";
import { useCreateStore, useSelector, useSelectorKey } from "../utils/store";
import { useLayoutEffect } from "../utils/use-layout-effect";
import { useStableCallback } from "../utils/use-stable-callback";

function EmojiPickerDataHandler() {
  const [emojiData, setEmojiData] = useState<EmojiData | undefined>(undefined);
  const store = useEmojiPickerStore();
  const locale = useSelectorKey(store, "locale");
  const columns = useSelectorKey(store, "columns");
  const skinTone = useSelectorKey(store, "skinTone");
  const search = useSelectorKey(store, "search");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getEmojiData(locale, signal)
      .then((data) => {
        setEmojiData(data);
      })
      .catch((error) => {
        if (!signal.aborted) {
          console.error(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [locale]);

  useEffect(() => {
    if (!emojiData) {
      return;
    }

    return requestIdleCallback(
      () => {
        store
          .get()
          .onDataChange(
            getEmojiPickerData(emojiData, columns, skinTone, search),
          );
      },
      { timeout: 100 },
    );
  }, [emojiData, columns, skinTone, search]);

  return null;
}

const EmojiPickerRoot = forwardRef<HTMLDivElement, EmojiPickerRootProps>(
  (
    {
      locale = "en",
      columns = 10,
      skinTone = "none",
      onEmojiSelect = noop,
      onFocusCapture,
      onBlurCapture,
      children,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const stableOnEmojiSelect = useStableCallback(onEmojiSelect);
    const store = useCreateStore(() =>
      createEmojiPickerStore(stableOnEmojiSelect, locale, columns, skinTone),
    );
    const [isFocusedWithin, setFocusedWithin] = useState(false);
    const ref = useRef<HTMLDivElement>(null!);
    const callbackRef = useCallback((element: HTMLDivElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ rootRef: ref });
      }
    }, []);

    useLayoutEffect(() => {
      store.set({ locale });
    }, [locale]);

    useLayoutEffect(() => {
      store.set({ columns });
    }, [columns]);

    useLayoutEffect(() => {
      store.set({ skinTone });
    }, [skinTone]);

    const handleFocusCapture = useCallback(
      (event: FocusEvent<HTMLDivElement>) => {
        onFocusCapture?.(event);

        if (!event.isDefaultPrevented()) {
          setFocusedWithin(true);
        }
      },
      [onFocusCapture],
    );

    const handleBlurCapture = useCallback(
      (event: FocusEvent<HTMLDivElement>) => {
        onBlurCapture?.(event);

        if (
          !event.isDefaultPrevented() &&
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setFocusedWithin(false);
          store.get().onActiveEmojiReset();
        }
      },
      [onBlurCapture],
    );

    useImperativeHandle(forwardedRef, () => ref.current);

    useEffect(() => {
      if (!isFocusedWithin) {
        return;
      }

      function handleKeyDown(event: KeyboardEvent) {
        if (
          event.defaultPrevented ||
          (!event.key.startsWith("Arrow") && event.key !== "Enter")
        ) {
          return;
        }

        const {
          data,
          onEmojiSelect,
          onActiveEmojiChange,
          interaction,
          activeColumnIndex,
          activeRowIndex,
        } = store.get();

        // Select the active emoji with enter if it exists
        if (event.key === "Enter") {
          const activeEmoji = $activeEmoji(store.get());

          if (activeEmoji) {
            event.preventDefault();

            onEmojiSelect(activeEmoji.emoji);
          }
        }

        // Move the active emoji with arrow keys
        if (event.key.startsWith("Arrow")) {
          let columnIndex = activeColumnIndex;
          let rowIndex = activeRowIndex;

          event.preventDefault();

          if (interaction !== "none") {
            if (data?.rows && data.rows.length > 0) {
              switch (event.key) {
                case "ArrowLeft": {
                  if (columnIndex === 0) {
                    const previousRowIndex = rowIndex - 1;
                    const previousRow = data.rows[previousRowIndex];

                    // If first column, move to last column of previous row (if available)
                    if (previousRow) {
                      rowIndex = previousRowIndex;
                      columnIndex = previousRow.emojis.length - 1;
                    }
                  } else {
                    // Otherwise, move to previous column
                    columnIndex -= 1;
                  }

                  break;
                }

                case "ArrowRight": {
                  if (columnIndex === data.rows[rowIndex]!.emojis.length - 1) {
                    const nextRowIndex = rowIndex + 1;
                    const nextRow = data.rows[nextRowIndex];

                    // If last column, move to first column of next row (if available)
                    if (nextRow) {
                      rowIndex = nextRowIndex;
                      columnIndex = 0;
                    }
                  } else {
                    // Otherwise, move to next column
                    columnIndex += 1;
                  }

                  break;
                }

                case "ArrowUp": {
                  const previousRow = data.rows[rowIndex - 1];

                  // If not first row, move to previous row
                  if (previousRow) {
                    rowIndex -= 1;

                    // If previous row doesn't have the same column, move to last column of previous row
                    if (!previousRow.emojis[columnIndex]) {
                      columnIndex = previousRow.emojis.length - 1;
                    }
                  }

                  break;
                }

                case "ArrowDown": {
                  const nextRow = data.rows[rowIndex + 1];

                  // If not last row, move to next row
                  if (nextRow) {
                    rowIndex += 1;

                    // If next row doesn't have the same column, move to last column of next row
                    if (!nextRow.emojis[columnIndex]) {
                      columnIndex = nextRow.emojis.length - 1;
                    }
                  }

                  break;
                }
              }
            }

            onActiveEmojiChange("keyboard", columnIndex, rowIndex);
          } else {
            onActiveEmojiChange("keyboard", 0, 0);
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isFocusedWithin]);

    useLayoutEffect(() => {
      let previousRowHeight: EmojiPickerStore["rowHeight"] = null;
      let previousCategoryHeaderHeight: EmojiPickerStore["categoryHeaderHeight"] =
        null;

      return store.subscribe((state) => {
        /* v8 ignore next 3 */
        if (!ref.current) {
          return;
        }

        if (previousRowHeight !== state.rowHeight) {
          previousRowHeight = state.rowHeight;

          ref.current.style.setProperty(
            "--frimousse-row-height",
            `${state.rowHeight}px`,
          );
        }

        if (previousCategoryHeaderHeight !== state.categoryHeaderHeight) {
          previousCategoryHeaderHeight = state.categoryHeaderHeight;

          ref.current.style.setProperty(
            "--frimousse-category-header-height",
            `${state.categoryHeaderHeight}px`,
          );
        }
      });
    }, []);

    return (
      <div
        data-focused={isFocusedWithin ? "" : undefined}
        frimousse-root=""
        onBlurCapture={handleBlurCapture}
        onFocusCapture={handleFocusCapture}
        {...props}
        ref={callbackRef}
        style={
          {
            "--frimousse-font-family": EMOJI_FONT_FAMILY,
            ...style,
          } as CSSProperties
        }
      >
        <EmojiPickerStoreProvider store={store}>
          <EmojiPickerDataHandler />
          {children}
        </EmojiPickerStoreProvider>
      </div>
    );
  },
);

const EmojiPickerSearch = forwardRef<HTMLInputElement, EmojiPickerSearchProps>(
  ({ value, defaultValue, onChange, disabled, ...props }, forwardedRef) => {
    const store = useEmojiPickerStore();
    const isLoading = useSelector(store, $isLoading);
    const ref = useRef<HTMLInputElement>(null!);
    const callbackRef = useCallback((element: HTMLInputElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ searchRef: ref });
      }
    }, []);

    // Initialize search with a controlled or uncontrolled value
    useLayoutEffect(() => {
      store.set({
        search:
          typeof value === "string"
            ? value
            : typeof defaultValue === "string"
              ? defaultValue
              : "",
      });
    }, []);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);

        if (!event.isDefaultPrevented()) {
          store.get().onSearchChange(event.target.value);
        }
      },
      [onChange],
    );

    useImperativeHandle(forwardedRef, () => ref.current);

    return (
      <input
        frimousse-search=""
        placeholder="Search emoji…"
        type="search"
        {...props}
        defaultValue={defaultValue}
        disabled={isLoading || disabled}
        onChange={handleChange}
        ref={callbackRef}
        value={value}
      />
    );
  },
);

const ActiveEmojiAnnouncer = memo(() => {
  const activeEmoji = useActiveEmoji();

  if (!activeEmoji) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      style={{
        border: 0,
        clip: "rect(0, 0, 0, 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        whiteSpace: "nowrap",
        width: 1,
        wordWrap: "normal",
      }}
    >
      {activeEmoji.label}
    </div>
  );
});

const EmojiPickerViewport = forwardRef<
  HTMLDivElement,
  EmojiPickerViewportProps
>(({ children, onScroll, style, ...props }, forwardedRef) => {
  const store = useEmojiPickerStore();
  const ref = useRef<HTMLDivElement>(null!);
  const callbackRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      ref.current = element;
      store.set({ viewportRef: ref });
    }
  }, []);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      onScroll?.(event);

      store.get().onViewportScroll(event.currentTarget.scrollTop);
    },
    [onScroll],
  );

  useLayoutEffect(() => {
    /* v8 ignore next 3 */
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry?.contentRect.height ?? 0;

      if (store.get().viewportHeight !== height) {
        store.get().onViewportHeightChange(height);
      }
    });

    resizeObserver.observe(ref.current);

    store.get().onViewportHeightChange(ref.current.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useImperativeHandle(forwardedRef, () => ref.current);

  return (
    <div
      frimousse-viewport=""
      {...props}
      onScroll={handleScroll}
      ref={callbackRef}
      style={{
        contain: "layout paint",
        overflowY: "auto",
        position: "relative",
        ...style,
      }}
    >
      <ActiveEmojiAnnouncer />
      {children}
    </div>
  );
});

function listEmojiProps(
  emoji: EmojiPickerEmoji,
  columnIndex: number,
  isActive: boolean,
): WithAttributes<EmojiPickerListEmojiProps> {
  return {
    emoji,
    isActive,
    role: "gridcell",
    "aria-colindex": columnIndex,
    "aria-selected": isActive || undefined,
    "data-active": isActive ? "" : undefined,
    "frimousse-emoji": "",
    style: {
      fontFamily: "var(--frimousse-font-family)",
    },
    tabIndex: -1,
  };
}

function listRowProps(
  rowIndex: number,
): WithAttributes<EmojiPickerListRowProps> {
  return {
    role: "row",
    "aria-rowindex": rowIndex,
    "frimousse-row": "",
    style: {
      contain: "content",
      display: "flex",
      height: "var(--frimousse-row-height)",
    },
  };
}

function listCategoryHeaderProps(
  category: EmojiPickerCategory,
): WithAttributes<EmojiPickerListCategoryHeaderProps> {
  return {
    category,
    "frimousse-category-header": "",
    style: {
      contain: "layout paint",
      height: "var(--frimousse-category-header-height)",
      pointerEvents: "auto",
      position: "sticky",
      top: 0,
    },
  };
}

function preventDefault(event: SyntheticEvent) {
  event.preventDefault();
}

const EmojiPickerListEmoji = memo(
  ({
    Emoji,
    emoji,
    columnIndex,
    rowIndex,
  }: {
    emoji: EmojiPickerEmoji;
    columnIndex: number;
    rowIndex: number;
  } & Pick<EmojiPickerListComponents, "Emoji">) => {
    const store = useEmojiPickerStore();
    const isActive = useSelector(
      store,
      (state) => $activeEmoji(state)?.emoji === emoji.emoji,
    );

    const handleSelect = useCallback(() => {
      store.get().onEmojiSelect(emoji.emoji);
    }, [emoji.emoji]);

    const handlePointerEnter = useCallback(() => {
      store.get().onActiveEmojiChange("pointer", columnIndex, rowIndex);
    }, [columnIndex, rowIndex]);

    const handlePointerLeave = useCallback(() => {
      store.get().onActiveEmojiReset();
    }, []);

    return (
      <Emoji
        {...listEmojiProps(emoji, columnIndex, isActive)}
        onClick={handleSelect}
        onPointerDown={preventDefault}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    );
  },
);

const EmojiPickerListRow = memo(
  ({
    Row,
    Emoji,
    rowIndex,
  }: { rowIndex: number } & Pick<
    EmojiPickerListComponents,
    "Emoji" | "Row"
  >) => {
    const store = useEmojiPickerStore();
    const row = useSelector(
      store,
      (state) => state.data?.rows[rowIndex],
      sameEmojiPickerRow,
    );

    if (!row) {
      return null;
    }

    return (
      <Row {...listRowProps(rowIndex)}>
        {row.emojis.map((emoji, columnIndex) => (
          <EmojiPickerListEmoji
            Emoji={Emoji}
            columnIndex={columnIndex}
            emoji={emoji}
            key={emoji.label}
            rowIndex={rowIndex}
          />
        ))}
      </Row>
    );
  },
);

const EmojiPickerListCategory = memo(
  ({
    CategoryHeader,
    categoryIndex,
  }: { categoryIndex: number } & Pick<
    EmojiPickerListComponents,
    "CategoryHeader"
  >) => {
    const store = useEmojiPickerStore();
    const dataCategory = useSelector(
      store,
      (state) => state.data?.categories[categoryIndex],
      shallow,
    );
    const category = useMemo(() => {
      if (!dataCategory) {
        return;
      }

      return {
        label: dataCategory.label,
      };
    }, [dataCategory]);

    if (!dataCategory || !category) {
      return null;
    }

    return (
      <div
        frimousse-category=""
        style={{
          contain: "content",
          height: `calc(var(--frimousse-category-header-height) + ${dataCategory.rowsCount} * var(--frimousse-row-height))`,
          width: "100%",
          pointerEvents: "none",
          position: "absolute",
          top: `calc(${categoryIndex} * var(--frimousse-category-header-height) + ${dataCategory.startRowIndex} * var(--frimousse-row-height))`,
        }}
      >
        <CategoryHeader {...listCategoryHeaderProps(category)} />
      </div>
    );
  },
);

const EmojiPickerListSizesHandler = memo(
  ({
    CategoryHeader,
    Row,
    Emoji,
  }: Pick<EmojiPickerListComponents, "CategoryHeader" | "Row" | "Emoji">) => {
    const store = useEmojiPickerStore();
    const columns = useSelectorKey(store, "columns");
    const emojis = useMemo(
      () =>
        Array<EmojiPickerEmoji>(columns).fill({
          emoji: "🙂",
          label: "",
          shortcode: "",
        }),
      [columns],
    );
    const category: EmojiPickerCategory = useMemo(
      () => ({
        label: "Category",
      }),
      [],
    );
    const rowRef = useRef<HTMLDivElement>(null!);
    const categoryHeaderRef = useRef<HTMLDivElement>(null!);

    useLayoutEffect(() => {
      /* v8 ignore next 3 */
      if (!rowRef.current || !categoryHeaderRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;

          if (
            entry.target === rowRef.current &&
            store.get().rowHeight !== height
          ) {
            store.get().onRowHeightChange(height);
          }

          if (
            entry.target === categoryHeaderRef.current &&
            store.get().categoryHeaderHeight !== height
          ) {
            store.get().onCategoryHeaderHeightChange(height);
          }
        }
      });

      resizeObserver.observe(rowRef.current);
      resizeObserver.observe(categoryHeaderRef.current);

      store.get().onRowHeightChange(rowRef.current.clientHeight);
      store
        .get()
        .onCategoryHeaderHeightChange(categoryHeaderRef.current.clientHeight);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        aria-hidden
        style={{
          height: 0,
          visibility: "hidden",
        }}
      >
        <div frimousse-row-sizer="" ref={rowRef}>
          <Row {...listRowProps(-1)}>
            {emojis.map((emoji, index) => (
              <Emoji key={index} {...listEmojiProps(emoji, index, false)} />
            ))}
          </Row>
        </div>
        <div
          frimousse-category=""
          style={{
            contain: "content",
            pointerEvents: "none",
            position: "absolute",
            width: "100%",
          }}
        >
          <div frimousse-category-header-sizer="" ref={categoryHeaderRef}>
            <CategoryHeader {...listCategoryHeaderProps(category)} />
          </div>
        </div>
      </div>
    );
  },
);

function DefaultEmojiPickerListCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return <div {...props}>{category.label}</div>;
}

function DefaultEmojiPickerListEmoji({
  emoji,
  isActive: _,
  ...props
}: EmojiPickerListEmojiProps) {
  return (
    <button type="button" {...props}>
      <span aria-label={emoji.label} role="img">
        {emoji.emoji}
      </span>
    </button>
  );
}

function DefaultEmojiPickerListRow({ ...props }: EmojiPickerListRowProps) {
  return <div {...props} />;
}

const EmojiPickerList = forwardRef<HTMLDivElement, EmojiPickerListProps>(
  ({ style, components, ...props }, forwardedRef) => {
    const store = useEmojiPickerStore();
    const ref = useRef<HTMLDivElement>(null!);
    const callbackRef = useCallback((element: HTMLDivElement | null) => {
      if (element) {
        ref.current = element;
        store.set({ listRef: ref });
      }
    }, []);
    const CategoryHeader =
      components?.CategoryHeader ?? DefaultEmojiPickerListCategoryHeader;
    const Emoji = components?.Emoji ?? DefaultEmojiPickerListEmoji;
    const Row = components?.Row ?? DefaultEmojiPickerListRow;
    const columns = useSelectorKey(store, "columns");
    const viewportStartRowIndex = useSelectorKey(
      store,
      "viewportStartRowIndex",
    );
    const viewportEndRowIndex = useSelectorKey(store, "viewportEndRowIndex");
    const rowsCount = useSelector(store, $rowsCount);
    const categoriesRowsStartIndices = useSelector(
      store,
      $categoriesRowsStartIndices,
      shallow,
    );
    const previousHeadersCount = useMemo(() => {
      return (
        categoriesRowsStartIndices?.filter(
          (index) => index < viewportStartRowIndex,
        ).length ?? 0
      );
    }, [categoriesRowsStartIndices, viewportStartRowIndex]);
    const categoriesCount = categoriesRowsStartIndices?.length ?? 0;

    useImperativeHandle(forwardedRef, () => ref.current);

    if (!rowsCount || !categoriesRowsStartIndices || categoriesCount === 0) {
      return (
        <div {...props} style={style}>
          <EmojiPickerListSizesHandler
            CategoryHeader={CategoryHeader}
            Emoji={Emoji}
            Row={Row}
          />
        </div>
      );
    }

    return (
      <div
        aria-colcount={columns}
        aria-rowcount={rowsCount}
        frimousse-list=""
        role="grid"
        {...props}
        ref={callbackRef}
        style={{
          height: `calc(${rowsCount} * var(--frimousse-row-height) + ${categoriesCount} * var(--frimousse-category-header-height))`,
          paddingTop: `calc(${viewportStartRowIndex} * var(--frimousse-row-height) + ${previousHeadersCount} * var(--frimousse-category-header-height))`,
          ...style,
        }}
      >
        <EmojiPickerListSizesHandler
          CategoryHeader={CategoryHeader}
          Emoji={Emoji}
          Row={Row}
        />
        {Array.from(
          { length: viewportEndRowIndex - viewportStartRowIndex + 1 },
          (_, index) => {
            const rowIndex = viewportStartRowIndex + index;
            const categoryIndex = categoriesRowsStartIndices.indexOf(rowIndex);

            return (
              <Fragment key={rowIndex}>
                {categoryIndex >= 0 && (
                  <div
                    style={{
                      height: "var(--frimousse-category-header-height)",
                    }}
                  />
                )}
                <EmojiPickerListRow
                  Emoji={Emoji}
                  Row={Row}
                  rowIndex={rowIndex}
                />
              </Fragment>
            );
          },
        )}
        {Array.from({ length: categoriesCount }, (_, index) => (
          <EmojiPickerListCategory
            CategoryHeader={CategoryHeader}
            categoryIndex={index}
            key={index}
          />
        ))}
      </div>
    );
  },
);

const EmojiPickerSkinToneSelector = forwardRef<
  HTMLButtonElement,
  EmojiPickerSkinToneSelectorProps
>(
  (
    { emoji, onClick, "aria-label": ariaLabel = "Change skin tone", ...props },
    forwardedRef,
  ) => {
    const store = useEmojiPickerStore();
    const skinTones = useSelector(store, $skinTones, shallow);
    const [skinTone, setSkinTone, skinTonesVariations] = useSkinTone(emoji);

    const skinToneVariationIndex = useMemo(
      () =>
        Math.max(
          0,
          skinTonesVariations.findIndex(
            (variation) => variation.skinTone === skinTone,
          ),
        ),
      [skinTone, skinTonesVariations],
    );

    const skinToneVariation = skinTonesVariations[skinToneVariationIndex]!;
    const nextSkinToneVariation =
      skinTonesVariations[
        (skinToneVariationIndex + 1) % skinTonesVariations.length
      ]!;
    const nextSkinTone = nextSkinToneVariation.skinTone;

    const skinToneLabel =
      skinTone === "none" ? undefined : skinTones?.[skinTone];
    const nextSkinToneLabel =
      nextSkinTone === "none" ? undefined : skinTones?.[nextSkinTone];

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (!event.isDefaultPrevented()) {
          setSkinTone(nextSkinTone);
        }
      },
      [onClick, setSkinTone, nextSkinTone],
    );

    return (
      <button
        type="button"
        {...props}
        aria-label={
          ariaLabel + (nextSkinToneLabel ? ` (${nextSkinToneLabel})` : "")
        }
        aria-live="polite"
        aria-valuetext={skinToneLabel}
        onClick={handleClick}
        ref={forwardedRef}
      >
        {skinToneVariation.emoji}
      </button>
    );
  },
);

function EmojiPickerLoading({ children }: EmojiPickerLoadingProps) {
  const store = useEmojiPickerStore();
  const isLoading = useSelector(store, $isLoading);

  if (!isLoading) {
    return null;
  }

  return <>{children}</>;
}

function EmojiPickerEmptyWithSearch({
  children,
}: { children: (props: { search: string }) => ReactNode }) {
  const store = useEmojiPickerStore();
  const search = useSelector(store, $search);

  return children({ search });
}

function EmojiPickerEmpty({ children }: EmojiPickerEmptyProps) {
  const store = useEmojiPickerStore();
  const isEmpty = useSelector(store, $isEmpty);

  if (!isEmpty) {
    return null;
  }

  return typeof children === "function" ? (
    <EmojiPickerEmptyWithSearch>{children}</EmojiPickerEmptyWithSearch>
  ) : (
    children
  );
}

function EmojiPickerActiveEmoji({ children }: EmojiPickerActiveEmojiProps) {
  const activeEmoji = useActiveEmoji();

  return children({ emoji: activeEmoji });
}

function EmojiPickerSkinTone({ children }: EmojiPickerSkinToneProps) {
  const [skinTone, setSkinTone, skinTones] = useSkinTone();

  return children({ skinTone, setSkinTone, skinTones });
}

export {
  EmojiPickerRoot as Root, //                         <EmojiPicker.Root />
  EmojiPickerSearch as Search, //                     <EmojiPicker.Search />
  EmojiPickerViewport as Viewport, //                 <EmojiPicker.Viewport />
  EmojiPickerList as List, //                         <EmojiPicker.List />
  EmojiPickerSkinToneSelector as SkinToneSelector, // <EmojiPicker.SkinToneSelector />
  EmojiPickerLoading as Loading, //                   <EmojiPicker.Loading />
  EmojiPickerEmpty as Empty, //                       <EmojiPicker.Empty />
  EmojiPickerActiveEmoji as ActiveEmoji, //           <EmojiPicker.ActiveEmoji />
  EmojiPickerSkinTone as SkinTone, //                 <EmojiPicker.SkinTone />
};
