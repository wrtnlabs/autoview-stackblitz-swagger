
import { IAutoViewComponentProps } from "@autoview/interface";
import { renderComponent } from "@autoview/ui";
import { createRoot } from "react-dom/client";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import { transform } from "./transform";

import "./index.css";

function Application() {
  return <div className="max-w-[512px] mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-center">AutoView Playground</h1>
      <ol className="list-decimal list-inside text-xs mt-4">
        <li className="py-1">
          Edit <CodeBlock>src/env.ts</CodeBlock> to set your API key.
        </li>
        <li className="py-1">
          Edit <CodeBlock>src/YourSchema.ts</CodeBlock> to define your own schema.
        </li>
        <li className="py-1">
          Run <CodeBlock>npm run generate</CodeBlock> to generate the component.
        </li>
        <li className="py-1">
          Run <CodeBlock>npm run start</CodeBlock> to see the component in action.
        </li>
      </ol>
    <div className="mt-8">
      <AutoViewComponent />
    </div>
  </div>
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return <code className="bg-gray-200 px-1 py-0.5 rounded-md font-bold">{children}</code>
}

function AutoViewComponent() {
  const input: YourSchema = typia.random<YourSchema>();
  const props: IAutoViewComponentProps = transform(input);
  return renderComponent(props);
}

const root: HTMLElement = window.document.getElementById("root")!;
createRoot(root).render(<Application />);
