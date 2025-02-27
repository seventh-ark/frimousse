"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Locale, SkinTone } from "frimousse";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { EmojiPicker } from "./ui/emoji-picker";

export const EmojiPickerPlayground = () => {
  const [columns, setColumns] = useState(10);
  const [locale, setLocale] = useState<Locale>("en");
  const { theme, setTheme } = useTheme();
  const [skinTone, setSkinTone] = useState<SkinTone>("none");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <p>{theme}</p>
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open emoji picker</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <EmojiPicker
            columns={columns}
            locale={locale}
            onEmojiSelect={(emoji) => {
              console.log(emoji);
            }}
            skinTone={skinTone}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
