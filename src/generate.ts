import { MainAgent } from "@autoview/agent";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import typia from "typia";

import { YourSchema } from "./YourSchema";

dotenv.config();

const main = async (): Promise<void> => {
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
