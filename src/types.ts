import type {
  Emoji as EmojibaseEmoji,
  Group as EmojibaseGroup,
  Locale as EmojibaseLocale,
  SkinToneKey as EmojibaseSkinToneKey,
} from "emojibase";
import type { ComponentProps, ComponentType, ReactNode } from "react";

type Resolve<T> = T extends (...args: unknown[]) => unknown
  ? T
  : { [K in keyof T]: T[K] };

export type WithAttributes<T> = T & {
  [attribute: `frimousse-${string}` | `data-${string}`]:
    | string
    | number
    | undefined;
};

export type {
  Emoji as EmojibaseEmoji,
  MessagesDataset as EmojibaseMessagesDataset,
  SkinTone as EmojibaseSkinTone,
} from "emojibase";

export type EmojibaseEmojiWithGroup = EmojibaseEmoji & {
  group: EmojibaseGroup;
};

export type Locale = Resolve<EmojibaseLocale>;

export type SkinTone = Resolve<"none" | EmojibaseSkinToneKey>;

export type SkinToneVariation = {
  skinTone: SkinTone;
  emoji: string;
};

export type Emoji = Resolve<EmojiPickerEmoji>;

export type Category = Resolve<EmojiPickerCategory>;

export type EmojiDataEmoji = {
  emoji: string;
  category: number;
  label: string;
  version: number;
  tags: string[];
  countryFlag: true | undefined;
  skins: Record<Exclude<SkinTone, "none">, string> | undefined;
};

export type EmojiDataCategory = {
  index: number;
  label: string;
};

export type EmojiData = {
  locale: Locale;
  emojis: EmojiDataEmoji[];
  categories: EmojiDataCategory[];
  skinTones: Record<Exclude<SkinTone, "none">, string>;
};

export type EmojiPickerEmoji = {
  emoji: string;
  label: string;
};

export type EmojiPickerCategory = {
  label: string;
};

export type EmojiPickerDataRow = {
  categoryIndex: number;
  emojis: EmojiPickerEmoji[];
};

export type EmojiPickerDataCategory = {
  label: string;
  rowsCount: number;
  startRowIndex: number;
};

export type EmojiPickerData = {
  count: number;
  categories: EmojiPickerDataCategory[];
  categoriesStartRowIndices: number[];
  rows: EmojiPickerDataRow[];
  skinTones: Record<Exclude<SkinTone, "none">, string>;
};

export type EmojiPickerListComponents = {
  CategoryHeader: ComponentType<EmojiPickerListCategoryHeaderProps>;
  Row: ComponentType<EmojiPickerListRowProps>;
  Emoji: ComponentType<EmojiPickerListEmojiProps>;
};

export type EmojiPickerListRowProps = ComponentProps<"div">;

export interface EmojiPickerListCategoryHeaderProps
  extends Omit<ComponentProps<"div">, "children"> {
  category: Category;
}

export interface EmojiPickerListEmojiProps
  extends Omit<ComponentProps<"button">, "children"> {
  emoji: Emoji;
  isActive: boolean;
}

export interface EmojiPickerListProps extends ComponentProps<"div"> {
  components?: Partial<EmojiPickerListComponents>;
}

export interface EmojiPickerRootProps extends ComponentProps<"div"> {
  locale?: Locale;
  skinTone?: SkinTone;
  columns?: number;
  onEmojiSelect?: (emoji: string) => void;
}

export type EmojiPickerViewportProps = ComponentProps<"div">;

export type EmojiPickerSearchProps = ComponentProps<"input">;

export interface EmojiPickerSkinToneSelectorProps
  extends Omit<ComponentProps<"button">, "children"> {
  emoji?: string;
}

export type EmojiPickerLoadingProps = {
  children?: ReactNode;
};

export type EmojiPickerEmptyRenderProps = {
  search: string;
};

export type EmojiPickerEmptyProps = {
  children?: ReactNode | ((props: EmojiPickerEmptyRenderProps) => ReactNode);
};

export type EmojiPickerActiveEmojiRenderProps = {
  emoji?: Emoji;
};

export type EmojiPickerActiveEmojiProps = {
  children: (props: EmojiPickerActiveEmojiRenderProps) => ReactNode;
};

export type EmojiPickerSkinToneRenderProps = {
  skinTone: SkinTone;
  setSkinTone: (skinTone: SkinTone) => void;
  skinTones: SkinToneVariation[];
};

export type EmojiPickerSkinToneProps = {
  children: (props: EmojiPickerSkinToneRenderProps) => ReactNode;
};
