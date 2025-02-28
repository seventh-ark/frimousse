import { CodeBlock } from "@/components/ui/code-block";

const USAGE_CODE = `import { EmojiPickerPrimitive } from 'frimousse'

// ...

function App() {
  return (
    <div>
      <EmojiPickerPrimitive.Root>
        …
      </EmojiPickerPrimitive.Root>
    </div>
  );
}`;

export const Usage = () => {
  return (
    <div>
      <h2>Usage</h2>
      <CodeBlock lang="tsx">{USAGE_CODE}</CodeBlock>
    </div>
  );
};
