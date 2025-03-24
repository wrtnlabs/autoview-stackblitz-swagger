import { IAutoViewComponentProps } from "@autoview/interface";
import { renderComponent } from "@autoview/ui";
import { createRoot } from "react-dom/client";
import typia from "typia";

import { YourSchema, value } from "./YourSchema";
import { transform } from "./transform";

function Application() {
  return (
    <div className="max-w-[512px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center">AutoView Playground</h1>
      <Section title="Result">
        <div className="mt-8">
          <AutoViewComponent />
        </div>
      </Section>
      <Section title="How to use">
        <ol className="list-decimal list-inside text-xs mt-4">
          <li className="py-1">
            Edit <CodeBlock>src/env.ts</CodeBlock> to set your API key.
          </li>
          <li className="py-1">
            Edit <CodeBlock>src/YourSchema.ts</CodeBlock> to define your own
            schema (and value).
          </li>
          <li className="py-1">
            Run <CodeBlock>npm run generate</CodeBlock> to generate the
            component.
            <ul className="list-disc list-inside text-xs mt-2 pl-3 text-gray-500">
              <li className="py-0.5">
                It takes some time (about a minute) to generate the component.
              </li>
              <li className="py-0.5">
                You can see the generated code in{" "}
                <CodeBlock>src/transform.ts</CodeBlock>
              </li>
            </ul>
          </li>
          <li className="py-1">
            Run <CodeBlock>npm run start</CodeBlock> to see the component in
            action.
          </li>
        </ol>
        <p className="text-xs mt-4 text-gray-600">
          <span className="text-red-500">*</span> All operations are run in your
          browser only, so no data is sent to the server.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-center">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-200 px-1 py-0.5 rounded-md font-bold">
      {children}
    </code>
  );
}

function AutoViewComponent() {
  const input: YourSchema = value ?? typia.random<YourSchema>();
  const props: IAutoViewComponentProps = transform(input);
  return renderComponent(props);
}

const root: HTMLElement = window.document.getElementById("root")!;
createRoot(root).render(<Application />);
