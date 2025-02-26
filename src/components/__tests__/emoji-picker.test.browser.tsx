import { page, userEvent } from "@vitest/browser/context";
import { Children, type ReactNode, useState } from "react";
import { describe, expect, it } from "vitest";
import type {
  EmojiPickerEmptyProps,
  EmojiPickerListProps,
  EmojiPickerRootProps,
  EmojiPickerSearchProps,
} from "../../types";
import * as EmojiPicker from "../emoji-picker";

function DefaultPage({
  children,
  locale,
  columns,
  skinTone,
  listComponents,
  viewportHeight = 400,
  searchDefaultValue,
  searchValue,
  searchOnChange,
  rootChildren,
  emptyChildren = <div data-testid="empty">No emojis found</div>,
}: {
  children?: ReactNode;
  locale?: EmojiPickerRootProps["locale"];
  columns?: EmojiPickerRootProps["columns"];
  skinTone?: EmojiPickerRootProps["skinTone"];
  listComponents?: EmojiPickerListProps["components"];
  viewportHeight?: number;
  searchDefaultValue?: EmojiPickerSearchProps["defaultValue"];
  searchOnChange?: EmojiPickerSearchProps["onChange"];
  searchValue?: EmojiPickerSearchProps["value"];
  rootChildren?: EmojiPickerRootProps["children"];
  emptyChildren?: EmojiPickerEmptyProps["children"];
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  return (
    <>
      <div>
        <p data-testid="selected-emoji">{selectedEmoji}</p>
        {children}
      </div>
      <div>
        <EmojiPicker.Root
          columns={columns}
          data-testid="root"
          locale={locale}
          onEmojiSelect={setSelectedEmoji}
          skinTone={skinTone}
        >
          <EmojiPicker.Search
            data-testid="search"
            defaultValue={searchDefaultValue}
            onChange={searchOnChange}
            value={searchValue}
          />
          <EmojiPicker.Loading>
            <div data-testid="loading">Loading…</div>
          </EmojiPicker.Loading>
          <EmojiPicker.Empty>{emptyChildren}</EmojiPicker.Empty>
          <EmojiPicker.Viewport
            data-testid="viewport"
            style={{ height: viewportHeight }}
          >
            <EmojiPicker.List components={listComponents} data-testid="list" />
          </EmojiPicker.Viewport>
          {rootChildren}
        </EmojiPicker.Root>
      </div>
    </>
  );
}

describe("EmojiPicker", () => {
  it("should render parts", async () => {
    page.render(<DefaultPage />);

    await expect.element(page.getByTestId("root")).toBeInTheDocument();
    await expect.element(page.getByTestId("search")).toBeInTheDocument();
    await expect.element(page.getByTestId("viewport")).toBeInTheDocument();
    await expect.element(page.getByTestId("list")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", async () => {
    page.render(<DefaultPage />);

    await expect
      .element(page.getByTestId("list"))
      .toHaveAttribute("role", "grid");
    await expect
      .element(page.getByTestId("list"))
      .toHaveAttribute("aria-rowcount");
    await expect
      .element(page.getByTestId("list"))
      .toHaveAttribute("aria-colcount");

    const rows = page.getByRole("row");

    await expect.element(rows.nth(5)).toHaveAttribute("aria-rowindex", "5");

    const emojis = page.getByRole("gridcell");

    await expect.element(emojis.first()).toHaveAttribute("role", "gridcell");
    await expect.element(emojis.first()).toHaveAttribute("aria-colindex", "0");

    await emojis.nth(2).hover();
    await emojis.first().hover();

    await expect.element(emojis.first()).toHaveAttribute("aria-selected");

    await expect
      .element(page.getByTestId("search"))
      .toHaveAttribute("type", "search");
  });

  it("should have the expected data attributes", async () => {
    page.render(
      <DefaultPage
        listComponents={{
          Emoji: ({ emoji, isActive, ...props }) => (
            <button
              data-testid={`emoji: ${emoji.emoji}`}
              type="button"
              {...props}
            >
              {isActive ? emoji.emoji : null}
            </button>
          ),
        }}
      />,
    );

    await expect
      .element(page.getByTestId("root"))
      .not.toHaveAttribute("data-focused");

    await page.getByTestId("search").click();

    await expect
      .element(page.getByTestId("root"))
      .toHaveAttribute("data-focused");

    await expect
      .element(page.getByTestId("emoji: 😀"))
      .not.toHaveAttribute("data-active");

    await page.getByTestId("emoji: 😀").hover();

    await expect
      .element(page.getByTestId("emoji: 😀"))
      .toHaveAttribute("data-active");
  });

  it("should support selecting an emoji on click", async () => {
    page.render(<DefaultPage />);

    await page.getByText("😀").click();

    await expect
      .element(page.getByTestId("selected-emoji"))
      .toHaveTextContent("😀");
  });

  it("should support navigating and selecting an emoji with the keyboard", async () => {
    page.render(<DefaultPage columns={4} />);

    await page.getByTestId("search").click();

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expect
      .element(page.getByTestId("selected-emoji"))
      .toHaveTextContent("😀");

    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowBottom}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowTop}");
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{Enter}");

    await expect
      .element(page.getByTestId("selected-emoji"))
      .toHaveTextContent("😀");
  });

  it("should reset the active emoji when losing focus", async () => {
    page.render(
      <DefaultPage
        rootChildren={
          <EmojiPicker.ActiveEmoji>
            {({ emoji }) =>
              emoji ? <p data-testid="active-emoji">{emoji.label}</p> : null
            }
          </EmojiPicker.ActiveEmoji>
        }
      />,
    );

    await page.getByTestId("search").click();

    await userEvent.keyboard("{ArrowDown}");

    await expect
      .element(page.getByTestId("active-emoji"))
      .toHaveTextContent("Grinning face");

    await userEvent.tab({ shift: true });

    await expect
      .element(page.getByTestId("active-emoji"))
      .not.toBeInTheDocument();
  });
});

describe("EmojiPicker.Root", () => {
  it("should support an initial locale and changing it", async () => {
    function Page() {
      const [locale, setLocale] =
        useState<EmojiPickerRootProps["locale"]>("fr");

      return (
        <DefaultPage locale={locale}>
          <button
            data-testid="set-locale-en"
            onClick={() => setLocale("en")}
            type="button"
          >
            Switch to English
          </button>
        </DefaultPage>
      );
    }

    page.render(<Page />);

    await expect
      .element(page.getByText("Smileys et émotion"))
      .toBeInTheDocument();

    await page.getByTestId("set-locale-en").click();

    await expect
      .element(page.getByText("Smileys & Emotion"))
      .toBeInTheDocument();
  });

  it("should support an initial skin tone and changing it", async () => {
    function Page() {
      const [skinTone, setSkinTone] =
        useState<EmojiPickerRootProps["skinTone"]>("dark");

      return (
        <DefaultPage skinTone={skinTone} viewportHeight={2000}>
          <button
            data-testid="set-skin-tone-none"
            onClick={() => setSkinTone("none")}
            type="button"
          >
            Change skin tone to none
          </button>
        </DefaultPage>
      );
    }

    page.render(<Page />);

    await expect.element(page.getByText("🧑🏿‍🤝‍🧑🏿")).toBeInTheDocument();

    await page.getByTestId("set-skin-tone-none").click();

    await expect.element(page.getByText("🧑‍🤝‍🧑")).toBeInTheDocument();
  });

  it("should support an initial columns count and changing it", async () => {
    function Page() {
      const [columns, setColumns] = useState(5);

      return (
        <DefaultPage
          columns={columns}
          listComponents={{
            Row: ({ children, ...props }) => (
              <div {...props}>
                {Children.count(children)} {children}
              </div>
            ),
          }}
        >
          <button
            data-testid="set-columns-8"
            onClick={() => setColumns(8)}
            type="button"
          >
            Switch to 8 columns
          </button>
        </DefaultPage>
      );
    }

    page.render(<Page />);

    await expect
      .element(page.getByRole("gridcell").nth(4))
      .toHaveAttribute("aria-colindex", "4");
    await expect
      .element(page.getByRole("gridcell").nth(5))
      .toHaveAttribute("aria-colindex", "0");
    await expect
      .element(page.getByRole("gridcell").nth(9))
      .toHaveAttribute("aria-colindex", "4");

    await page.getByTestId("set-columns-8").click();

    await expect
      .element(page.getByRole("gridcell").nth(7))
      .toHaveAttribute("aria-colindex", "7");
  });
});

describe("EmojiPicker.Search", () => {
  it("should support searching", async () => {
    page.render(<DefaultPage />);

    await page.getByTestId("search").fill("cat");

    await expect.element(page.getByText("🐈‍⬛")).toBeInTheDocument();
  });

  it("should support a default search value", async () => {
    page.render(<DefaultPage searchDefaultValue="hello" />);

    await expect.element(page.getByTestId("search")).toHaveValue("hello");
  });

  it("should support a controlled search value", async () => {
    function Page() {
      const [search, setSearch] = useState("");

      return (
        <DefaultPage
          searchOnChange={(event) => setSearch(event.target.value)}
          searchValue={search}
        >
          <button
            data-testid="update-search"
            onClick={() => setSearch("hello")}
            type="button"
          >
            Update search
          </button>
        </DefaultPage>
      );
    }

    page.render(<Page />);

    await expect.element(page.getByTestId("search")).toHaveValue("");

    await page.getByTestId("update-search").click();

    await expect.element(page.getByTestId("search")).toHaveValue("hello");
  });
});

describe("EmojiPicker.Viewport", () => {
  it("should virtualize rows", async () => {
    function Page() {
      const [viewportHeight, setViewportHeight] = useState(400);
      const [rowHeight, setRowHeight] = useState(30);
      const [categoryHeaderHeight, setCategoryHeaderHeight] = useState(30);

      return (
        <>
          <div>
            <input
              data-testid="viewport-height"
              onChange={(event) =>
                setViewportHeight(Number(event.target.value))
              }
              type="number"
              value={viewportHeight}
            />
            <input
              data-testid="row-height"
              onChange={(event) => setRowHeight(Number(event.target.value))}
              type="number"
              value={rowHeight}
            />
            <input
              data-testid="category-header-height"
              onChange={(event) =>
                setCategoryHeaderHeight(Number(event.target.value))
              }
              type="number"
              value={categoryHeaderHeight}
            />
          </div>
          <div>
            <EmojiPicker.Root data-testid="root">
              <EmojiPicker.Viewport
                data-testid="viewport"
                style={{ height: viewportHeight }}
              >
                <EmojiPicker.List
                  components={{
                    Row: ({
                      children,
                      "aria-rowindex": rowIndex,
                      style,
                      ...props
                    }) => (
                      <div
                        {...props}
                        data-testid={`row: ${rowIndex}`}
                        style={{ ...style, height: rowHeight }}
                      >
                        {children}
                      </div>
                    ),
                    CategoryHeader: ({ category, style, ...props }) => (
                      <div
                        {...props}
                        data-testid={`category-header: ${category.label}`}
                        style={{ ...style, height: categoryHeaderHeight }}
                      >
                        {category.label}
                      </div>
                    ),
                  }}
                  data-testid="list"
                />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          </div>
        </>
      );
    }

    page.render(<Page />);

    await expect.element(page.getByText("😀")).toBeInTheDocument();

    await expect.element(page.getByTestId("row: 10")).toBeInTheDocument();
    await expect.element(page.getByTestId("row: 20")).not.toBeInTheDocument();

    await page.getByTestId("viewport-height").fill("500");
    await page.getByTestId("row-height").fill("20");
    await page.getByTestId("category-header-height").fill("20");

    await expect.element(page.getByTestId("row: 10")).toBeInTheDocument();
    await expect.element(page.getByTestId("row: 20")).toBeInTheDocument();

    await page.getByTestId("viewport-height").fill("200");
    await page.getByTestId("row-height").fill("100");
    await page.getByTestId("category-header-height").fill("400");

    await expect.element(page.getByTestId("row: 10")).not.toBeInTheDocument();
    await expect.element(page.getByTestId("row: 20")).not.toBeInTheDocument();
  });
});

describe("EmojiPicker.List", () => {
  it("should support passing custom components", async () => {
    page.render(
      <DefaultPage
        listComponents={{
          Emoji: ({ emoji }) => (
            <button data-testid={`custom-emoji: ${emoji.emoji}`} type="button">
              {emoji.label}
            </button>
          ),
          Row: ({ children, "aria-rowindex": rowIndex }) => (
            <div data-testid={`custom-row: ${rowIndex}`}>{children}</div>
          ),
          CategoryHeader: ({ category }) => (
            <div data-testid={`custom-category-header: ${category.label}`}>
              {category.label}
            </div>
          ),
        }}
      />,
    );

    await expect
      .element(page.getByTestId("custom-emoji: 🥲"))
      .toHaveTextContent("Smiling face with tear");
    await expect.element(page.getByTestId("custom-row: 1")).toBeInTheDocument();
    await expect
      .element(page.getByTestId("custom-category-header: Activities"))
      .toHaveTextContent("Activities");
  });
});

describe("EmojiPicker.Loading", () => {
  it("should render when loading emojis", async () => {
    page.render(<DefaultPage />);

    await expect.element(page.getByTestId("loading")).toBeInTheDocument();
  });
});

describe("EmojiPicker.Empty", () => {
  it("should render when no emojis are found", async () => {
    page.render(<DefaultPage />);

    await page.getByTestId("search").fill("..........");

    await expect
      .element(page.getByTestId("empty"))
      .toHaveTextContent("No emojis found");
  });

  it("should support displaying the search value", async () => {
    page.render(
      <DefaultPage
        emptyChildren={({ search }) => (
          <div data-testid="empty">{`No emojis found for ${search}`}</div>
        )}
      />,
    );

    await page.getByTestId("search").fill("..........");

    await expect
      .element(page.getByTestId("empty"))
      .toHaveTextContent("No emojis found for ..........");
  });
});

describe("EmojiPicker.ActiveEmoji", () => {
  it("should expose the active emoji", async () => {
    page.render(
      <DefaultPage
        rootChildren={
          <EmojiPicker.ActiveEmoji>
            {({ emoji }) =>
              emoji ? <div data-testid="active-emoji">{emoji.label}</div> : null
            }
          </EmojiPicker.ActiveEmoji>
        }
      />,
    );

    await expect
      .element(page.getByTestId("active-emoji"))
      .not.toBeInTheDocument();

    await page.getByText("😀").hover();

    await expect
      .element(page.getByTestId("active-emoji"))
      .toHaveTextContent("Grinning face");

    await page.getByText("😊").hover();

    await expect
      .element(page.getByTestId("active-emoji"))
      .toHaveTextContent("Smiling face with smiling eyes");
  });
});

describe("EmojiPicker.SkinTone", () => {
  it("should expose the current skin tone and allow changing it", async () => {
    page.render(
      <DefaultPage
        rootChildren={
          <EmojiPicker.SkinTone>
            {({ skinTone, setSkinTone }) => (
              <div>
                <p data-testid="skin-tone">{skinTone}</p>
                <button
                  data-testid="set-skin-tone-dark"
                  onClick={() => setSkinTone("dark")}
                  type="button"
                >
                  Change skin tone to dark
                </button>
              </div>
            )}
          </EmojiPicker.SkinTone>
        }
      />,
    );

    await expect
      .element(page.getByTestId("skin-tone"))
      .toHaveTextContent("none");

    await page.getByTestId("set-skin-tone-dark").click();

    await expect
      .element(page.getByTestId("skin-tone"))
      .toHaveTextContent("dark");
  });
});
