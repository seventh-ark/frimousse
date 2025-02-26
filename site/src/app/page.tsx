"use client";

import { EmojiPicker, type Locale } from "frimousse";
import { FrownIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import pkg from "../../../package.json";

export default function Page() {
  const [isOpen, setOpen] = useState(true);
  const [columns, setColumns] = useState(10);
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <>
      <header>v{pkg.version}</header>
      <main>
        <button onClick={() => setOpen(!isOpen)} type="button">
          Toggle
        </button>
        <input
          max={20}
          min={1}
          onChange={(event) => setColumns(Number(event.target.value))}
          step={1}
          type="range"
          value={columns}
        />
        <select
          onChange={(event) => setLocale(event.target.value as Locale)}
          value={locale}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
        </select>
        {isOpen && (
          <EmojiPicker.Root
            className="w-fit rounded-lg border border-gray-200 bg-white"
            columns={columns}
            locale={locale}
            onEmojiSelect={(emoji) => console.log(emoji)}
          >
            <EmojiPicker.Search />
            <EmojiPicker.Viewport className="h-[320px]">
              <EmojiPicker.Loading>
                <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                  <LoaderCircleIcon className="size-6 animate-spin" />
                  <span>Loading…</span>
                </div>
              </EmojiPicker.Loading>
              <EmojiPicker.Empty>
                <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                  <FrownIcon className="size-6" />
                  <span>No emoji found.</span>
                </div>
              </EmojiPicker.Empty>
              <EmojiPicker.List
                className="select-none"
                components={{
                  Row: ({ children, ...props }) => (
                    <div {...props} className="scroll-mb-1 px-1">
                      {children}
                    </div>
                  ),
                  Emoji: ({ emoji, isActive, ...props }) => (
                    <button
                      {...props}
                      aria-label={emoji.label}
                      className="flex size-7 cursor-pointer items-center justify-center rounded-md transition duration-100 data-[active]:bg-gray-100 data-[active]:duration-0"
                    >
                      <span className="whitespace-nowrap">{emoji.emoji}</span>
                    </button>
                  ),
                  CategoryHeader: ({ category, ...props }) => (
                    <div
                      {...props}
                      className="bg-white px-2 pt-2 pb-1.25 font-semibold text-gray-400 text-xs uppercase"
                    >
                      {category.label}
                    </div>
                  ),
                }}
              />
            </EmojiPicker.Viewport>
            <div className="flex w-full min-w-0 flex-1 border-gray-200 border-t p-2">
              <EmojiPicker.ActiveEmoji>
                {({ emoji }) => (
                  <>
                    <div className="-ml-1 mr-1 flex aspect-square w-9 items-center justify-center text-2xl">
                      {emoji?.emoji}
                    </div>
                    <div className="flex w-0 min-w-0 flex-1 flex-col justify-center text-xs">
                      <span className="truncate font-semibold text-gray-500">
                        {emoji?.label}
                      </span>
                      <span className="truncate text-gray-400">
                        {emoji?.shortcode}
                      </span>
                    </div>
                  </>
                )}
              </EmojiPicker.ActiveEmoji>
            </div>
          </EmojiPicker.Root>
        )}
      </main>
    </>
  );
}
