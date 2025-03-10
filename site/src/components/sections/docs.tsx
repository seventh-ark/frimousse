import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { PermalinkHeading } from "../permalink-heading";
import { CodeBlock } from "../ui/code-block";

export function Docs({
  className,
  ...props
}: Omit<ComponentProps<"section">, "children">) {
  return (
    <section className={cn("prose mt-10 md:mt-16", className)} {...props}>
      <PermalinkHeading as="h2">Installation</PermalinkHeading>
      <CodeBlock lang="bash">npm i frimousse</CodeBlock>
      <PermalinkHeading as="h2">Usage</PermalinkHeading>
      <p>
        Import the <code>EmojiPicker</code> parts and create your own component
        by composing them.
      </p>
      <CodeBlock lang="tsx">{`
        import { EmojiPicker } from "frimousse";
    
        export function MyEmojiPicker() {
          return (
            <EmojiPicker.Root>
              <EmojiPicker.Search />
              <EmojiPicker.Viewport>
                <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
                <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
                <EmojiPicker.List />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          );
        }
      `}</CodeBlock>
      <p>
        Apart from a few sizing and overflow defaults, the parts don’t have any
        styles out-of-the-box. Being composable, you can bring your own styles
        and apply them however you want:{" "}
        <a href="https://tailwindcss.com/" rel="noreferrer" target="_blank">
          Tailwind CSS
        </a>
        , CSS-in-JS, vanilla CSS via inline styles, classes, or by targeting the{" "}
        <code>[frimousse-*]</code> data attributes present on each part.
      </p>
      <p>
        Now that your emoji picker component is styled, you might want to use it
        in a popover rather than on its own. Frimousse only provides the emoji
        picker itself so if you don’t have a popover component in your app yet,
        there are several libraries you could use:{" "}
        <a
          href="https://www.radix-ui.com/primitives/docs/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Radix UI
        </a>
        ,{" "}
        <a
          href="https://base-ui.com/react/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Base UI
        </a>
        ,{" "}
        <a
          href="https://headlessui.com/react/popover"
          rel="noreferrer"
          target="_blank"
        >
          Headless UI
        </a>
        , and{" "}
        <a
          href="https://react-spectrum.adobe.com/react-aria/Popover.html"
          rel="noreferrer"
          target="_blank"
        >
          React Aria
        </a>
        , to name a few.
      </p>
      <PermalinkHeading as="h3">shadcn/ui</PermalinkHeading>
      <p>
        If you are using{" "}
        <a href="https://ui.shadcn.com/" rel="noreferrer" target="_blank">
          shadcn/ui
        </a>
        , you can install a pre-built component which integrates with the
        existing{" "}
        <a href="https://ui.shadcn.com/" rel="noreferrer" target="_blank">
          shadcn/ui
        </a>{" "}
        themes and components (e.g.{" "}
        <a
          href="https://ui.shadcn.com/docs/components/popover"
          rel="noreferrer"
          target="_blank"
        >
          Popover
        </a>
        ).
      </p>
      <CodeBlock lang="bash">
        npx shadcn@latest add https://frimousse.liveblocks.io/r/emoji-picker
      </CodeBlock>
      <PermalinkHeading as="h2">API Reference</PermalinkHeading>
      <p>All parts and hooks that are available.</p>
      <PermalinkHeading as="h3">EmojiPicker.Root</PermalinkHeading>
      <p>Contains all the parts of the emoji picker.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Root onEmojiSelect={(emoji) => console.log(emoji)}>
          <EmojiPicker.Search />
          <EmojiPicker.Viewport>
            <EmojiPicker.List />
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      `}</CodeBlock>
      <p>
        Options affecting the entire emoji picker (e.g. locale, columns, skin
        tone, etc) are available on this component.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Root locale="fr" columns={8} skinTone="medium">
          {/* … */}
        </EmojiPicker.Root>
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.Search</PermalinkHeading>
      <p>A search input to filter the list of emojis.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Root>
          <EmojiPicker.Search />
        </EmojiPicker.Root>
      `}</CodeBlock>
      <p>It can be controlled or uncontrolled.</p>
      <CodeBlock lang="tsx">{`
        const [search, setSearch] = useState("");

        return (
          <EmojiPicker.Root>
            <EmojiPicker.Search
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </EmojiPicker.Root>
        );
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.Viewport</PermalinkHeading>
      <p>The scrolling container of the emoji picker.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Viewport>
          <EmojiPicker.Loading>
            <span>Loading…</span>
          </EmojiPicker.Loading>
          <EmojiPicker.Empty>
            <span>No emoji found.</span>
          </EmojiPicker.Empty>
          <EmojiPicker.List />
        </EmojiPicker.Viewport>
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.List</PermalinkHeading>
      <p>The list of emojis.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Viewport>
          <EmojiPicker.List />
        </EmojiPicker.Viewport>
      `}</CodeBlock>
      <p>
        Inner components within the list can be customized via the{" "}
        <code>components</code> prop.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Viewport>
          <EmojiPicker.List
            components={{
              CategoryHeader: ({ category, ...props }) => (
                <div {...props}>{category.label}</div>
              ),
              Emoji: ({ emoji, isActive, ...props }) => (
                <button aria-label={emoji.label} {...props}>
                  {emoji.emoji}
                </button>
              ),
              Row: ({ children, ...props }) => <div {...props}>{children}</div>,
            }}
          />
        </EmojiPicker.Viewport>
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.Loading</PermalinkHeading>
      <p>Only renders when the emoji data is loading.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Viewport>
          <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
        </EmojiPicker.Viewport>
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.Empty</PermalinkHeading>
      <p>Only renders when no emoji is found for the current search.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Viewport>
          <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
        </EmojiPicker.Viewport>
      `}</CodeBlock>
      <p>
        It can also expose the current search via a render callback to build a
        more detailed empty state.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.Empty>
          {({ search }) => <>No emoji found for "{search}"</>}
        </EmojiPicker.Empty>
      `}</CodeBlock>
      <PermalinkHeading as="h3">EmojiPicker.SkinToneSelector</PermalinkHeading>
      <p>
        A button to change the current skin tone by cycling through the
        available skin tones.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.SkinToneSelector />
      `}</CodeBlock>
      <p>The emoji used as visual can be customized (by default, ✋).</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.SkinToneSelector emoji="👋" />
      `}</CodeBlock>
      <p>
        If you want to build a custom skin tone selector, you can use the{" "}
        <a href="#EmojiPicker.SkinTone">
          <code>EmojiPicker.SkinTone</code>
        </a>{" "}
        component or the{" "}
        <a href="#useSkinTone">
          <code>useSkinTone</code>
        </a>{" "}
        hook.
      </p>
      <PermalinkHeading as="h3">EmojiPicker.SkinTone</PermalinkHeading>
      <p>
        Exposes the current skin tone and a function to change it via a render
        callback.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.SkinTone>
          {({ skinTone, setSkinTone }) => (
            <div>
              <span>{skinTone}</span>
              <button onClick={() => setSkinTone("none")}>Reset skin tone</button>
            </div>
          )}
        </EmojiPicker.SkinTone>
      `}</CodeBlock>
      <p>
        It can be used to build a custom skin tone selector: pass an emoji you
        want to use as visual (by default, ✋) and it will return its skin tone{" "}
        variations.
      </p>
      <CodeBlock lang="tsx">{`
        const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");

        // [👋] [👋🏻] [👋🏼] [👋🏽] [👋🏾] [👋🏿]
        <EmojiPicker.SkinTone emoji="👋">
          {({ skinTone, setSkinTone, skinToneVariations }) => (
            skinToneVariations.map(({ skinTone, emoji }) => (
              <button key={skinTone} onClick={() => setSkinTone(skinTone)}>
                {emoji}
              </button>
            ))
          )}
        </EmojiPicker.SkinTone>
      `}</CodeBlock>
      <p>
        If you prefer to use a hook rather than a component,{" "}
        <a href="#useSkinTone">
          <code>useSkinTone</code>
        </a>{" "}
        is also available.
      </p>
      <p>
        An already-built skin tone selector is also available,{" "}
        <a href="#EmojiPicker.SkinToneSelector">
          <code>EmojiPicker.SkinToneSelector</code>
        </a>
        .
      </p>
      <PermalinkHeading as="h3">EmojiPicker.ActiveEmoji</PermalinkHeading>
      <p>
        Exposes the currently active emoji (either hovered or selected via
        keyboard navigation) via a render callback.
      </p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => <span>{emoji}</span>}
        </EmojiPicker.ActiveEmoji>
      `}</CodeBlock>
      <p>It can be used to build a preview area next to the list.</p>
      <CodeBlock lang="tsx">{`
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => (
            <div>
              {emoji ? (
                <span>{emoji.emoji} {emoji.label}</span>
              ) : (
                <span>Select an emoji…</span>
              )}
            </div>
          )}
        </EmojiPicker.ActiveEmoji>
      `}</CodeBlock>
      <p>
        If you prefer to use a hook rather than a component,{" "}
        <a href="#useActiveEmoji">
          <code>useActiveEmoji</code>
        </a>{" "}
        is also available.
      </p>
      <PermalinkHeading as="h3">useSkinTone</PermalinkHeading>
      <p>Returns the current skin tone and a function to change it.</p>
      <CodeBlock lang="tsx">{`
        const [skinTone, setSkinTone] = useSkinTone();
      `}</CodeBlock>
      <p>
        It can be used to build a custom skin tone selector: pass an emoji you
        want to use as visual (by default, ✋) and it will return its skin tone
        variations.
      </p>
      <CodeBlock lang="tsx">{`
        const [skinTone, setSkinTone, skinToneVariations] = useSkinTone("👋");

        // [👋] [👋🏻] [👋🏼] [👋🏽] [👋🏾] [👋🏿]
        skinToneVariations.map(({ skinTone, emoji }) => (
          <button key={skinTone} onClick={() => setSkinTone(skinTone)}>
            {emoji}
          </button>
        ));
      `}</CodeBlock>
      <p>
        If you prefer to use a component rather than a hook,{" "}
        <a href="#EmojiPicker.SkinTone">
          <code>EmojiPicker.SkinTone</code>
        </a>{" "}
        is also available.
      </p>
      <p>
        An already-built skin tone selector is also available,{" "}
        <a href="#EmojiPicker.SkinToneSelector">
          <code>EmojiPicker.SkinToneSelector</code>
        </a>
        .
      </p>
      <PermalinkHeading as="h3">useActiveEmoji</PermalinkHeading>
      <p>
        Returns the currently active emoji (either hovered or selected via
        keyboard navigation).
      </p>
      <CodeBlock lang="tsx">{`
        const activeEmoji = useActiveEmoji();
      `}</CodeBlock>
      <p>It can be used to build a preview area next to the list.</p>
      <CodeBlock lang="tsx">{`
        const activeEmoji = useActiveEmoji();

        <div>
          {activeEmoji ? (
            <span>{activeEmoji.emoji} {activeEmoji.label}</span>
          ) : (
            <span>Select an emoji…</span>
          )}
        </div>
      `}</CodeBlock>
      <p>
        If you prefer to use a component rather than a hook,{" "}
        <a href="#EmojiPicker.ActiveEmoji">
          <code>EmojiPicker.ActiveEmoji</code>
        </a>{" "}
        is also available.
      </p>
    </section>
  );
}
