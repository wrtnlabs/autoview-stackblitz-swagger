import { IAutoViewComponentProps } from "@autoview/interface";

import { YourSchema } from "./YourSchema";

export function transform(_input: YourSchema): IAutoViewComponentProps {
  return {
    type: "Image",
    src: "https://typia.io/logo.png",
  };
}
