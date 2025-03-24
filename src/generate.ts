import { MainAgent } from "@autoview/agent";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import { exit } from "process";
import typia from "typia";

import { YourSchema } from "./YourSchema";

dotenv.config();

const main = async (): Promise<void> => {
  checkApiKey();

  const result: MainAgent.IResult = await MainAgent.execute(
    {
      type: "chatgpt",
      api: new OpenAI({
        apiKey: typia.assert<string>(process.env.OPENAI_API_KEY),
      }),
      model: typia.assert<OpenAI.ChatModel>(process.env.OPENAI_MODEL),
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
    console.error("`OPENAI_API_KEY` is not set; please open the `.env` file and feed your own key");
    console.error("");
    console.error("[=================================]");
    console.error("");
    exit(-1);
  }
}
