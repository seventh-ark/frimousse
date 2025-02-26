"use client";

import { EmojiPicker, type Locale } from "frimousse";
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
            className="w-fit"
            columns={columns}
            locale={locale}
            onEmojiSelect={(emoji) => console.log(emoji)}
            skinTone="medium-dark"
          >
            <EmojiPicker.Search />
            <EmojiPicker.Viewport className="h-[400px]">
              <EmojiPicker.Loading>
                <span>Loading…</span>
              </EmojiPicker.Loading>
              <EmojiPicker.Empty>
                {({ search }) => <div>No emoji found for "{search}".</div>}
              </EmojiPicker.Empty>
              <EmojiPicker.List
                components={{
                  Row: ({ children, ...props }) => (
                    <div {...props} className="px-5">
                      {children}
                    </div>
                  ),
                  Emoji: ({ emoji, isActive, ...props }) => (
                    <button
                      {...props}
                      style={{
                        backgroundColor: isActive ? "red" : "transparent",
                      }}
                    >
                      {emoji.emoji}
                    </button>
                  ),
                }}
              />
            </EmojiPicker.Viewport>
            <EmojiPicker.ActiveEmoji>
              {({ emoji }) =>
                emoji ? (
                  <div>
                    {emoji.emoji} - {emoji.label} - {emoji.shortcode}
                  </div>
                ) : null
              }
            </EmojiPicker.ActiveEmoji>
            <EmojiPicker.SkinTone>
              {({ skinTone, skinTones, setSkinTone }) => (
                <div>
                  {skinTones.map(({ skinTone, emoji }) => (
                    <button
                      key={skinTone}
                      onPointerEnter={() => setSkinTone(skinTone)}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                  {skinTone}
                </div>
              )}
            </EmojiPicker.SkinTone>
          </EmojiPicker.Root>
        )}
      </main>
    </>
  );
}
