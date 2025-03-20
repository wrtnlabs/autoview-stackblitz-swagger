import { IAutoViewComponentProps } from "@autoview/interface";
import { renderComponent } from "@autoview/ui";
import { createRoot } from "react-dom/client";
import typia from "typia";

import { YourSchema } from "./YourSchema";
import { transform } from "./transform";

const Application = () => {
  const input: YourSchema = typia.random<YourSchema>();
  const props: IAutoViewComponentProps = transform(input);
  return renderComponent(props);
};

const root: HTMLElement = window.document.getElementById("root")!;
createRoot(root).render(<Application />);
