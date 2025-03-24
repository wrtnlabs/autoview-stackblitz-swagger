import { MainAgent } from "@autoview/agent";
import fs from "fs";
import OpenAI from "openai";
import { exit } from "process";
import typia from "typia";

import env from "./env";
import { YourSchema } from "./YourSchema";

const main = async (): Promise<void> => {
  checkApiKey();

  const result: MainAgent.IResult = await MainAgent.execute(
    {
      type: "chatgpt",
      api: new OpenAI({
        apiKey: typia.assert<string>(env.OPENAI_API_KEY),
      }),
      model: typia.assert<OpenAI.ChatModel>(env.OPENAI_MODEL),
    },
    typia.llm.parameters<YourSchema, "chatgpt">(),
  );
  await fs.promises.writeFile(
    "src/transform.ts",
    result.transformTsCode,
    "utf8",
  );
};

main().catch(console.error);

function checkApiKey(): void {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
    console.error("");
    console.error("[========= API KEY ERROR =========]");
    console.error("");
    console.error("`OPENAI_API_KEY` is not set; please open the `src/env.ts` file and feed your own key");
    console.error("");
    console.error("[=================================]");
    console.error("");
    exit(-1);
  }
}
