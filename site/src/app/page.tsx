"use client";

import { EmojiPicker, type Locale, type SkinTone } from "frimousse";
import { FrownIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import pkg from "../../../package.json";

export default function Page() {
  const [isOpen, setOpen] = useState(true);
  const [columns, setColumns] = useState(10);
  const [locale, setLocale] = useState<Locale>("en");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [skinTone, setSkinTone] = useState<SkinTone>("none");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    setSystemTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <header className="container py-6">
        <h1 className="font-headings text-3xl tracking-tight">Frimousse</h1>
        <span>v{pkg.version}</span>
      </header>
      <main className="container">
        <p>{theme === "system" ? systemTheme : theme}</p>
        <select
          onChange={(event) =>
            setTheme(event.target.value as "light" | "dark" | "system")
          }
          value={theme}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
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
          <option value="bn">Bengali</option>
          <option value="da">Danish</option>
          <option value="de">German</option>
          <option value="en-gb">English (UK)</option>
          <option value="en">English</option>
          <option value="es-mx">Spanish (Mexico)</option>
          <option value="es">Spanish</option>
          <option value="et">Estonian</option>
          <option value="fi">Finnish</option>
          <option value="fr">French</option>
          <option value="hi">Hindi</option>
          <option value="hu">Hungarian</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="lt">Lithuanian</option>
          <option value="ms">Malay</option>
          <option value="nb">Norwegian Bokmål</option>
          <option value="nl">Dutch</option>
          <option value="pl">Polish</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="sv">Swedish</option>
          <option value="th">Thai</option>
          <option value="uk">Ukrainian</option>
          <option value="vi">Vietnamese</option>
          <option value="zh-hant">Chinese (Traditional)</option>
          <option value="zh">Chinese (Simplified)</option>
        </select>
        <select
          onChange={(event) => setSkinTone(event.target.value as SkinTone)}
          value={skinTone}
        >
          <option value="none">None</option>
          <option value="light">Light</option>
          <option value="medium-light">Medium light</option>
          <option value="medium">Medium</option>
          <option value="medium-dark">Medium dark</option>
          <option value="dark">Dark</option>
        </select>
        {isOpen && (
          <EmojiPicker.Root
            className="w-fit rounded-lg border border-gray-200 bg-white"
            columns={columns}
            locale={locale}
            onEmojiSelect={(emoji) => console.log(emoji)}
            skinTone={skinTone}
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
                className="select-none pb-1"
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
            <div className="flex w-full min-w-0 flex-1 gap-1 border-gray-200 border-t p-2">
              <EmojiPicker.ActiveEmoji>
                {({ emoji }) => (
                  <>
                    <div className="-ml-1 flex size-9 items-center justify-center text-2xl">
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
              <EmojiPicker.SkinToneSelector
                className="-mr-0.5 size-9 cursor-pointer"
                emoji="👋"
              />
            </div>
          </EmojiPicker.Root>
        )}
      </main>
    </>
  );
}
