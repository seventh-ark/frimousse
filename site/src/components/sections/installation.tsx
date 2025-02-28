import { CodeBlock } from "../ui/code-block";

const INSTALL_COMMAND = "npm install frimousse";

export const Installation = () => {
  return (
    <div>
      <h2>Installation</h2>
      <CodeBlock lang="bash">{INSTALL_COMMAND}</CodeBlock>
    </div>
  );
};
