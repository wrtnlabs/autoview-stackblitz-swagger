import { MainAgent } from "@autoview/agent";
import {
  HttpLlm,
  IHttpLlmApplication,
  IHttpLlmFunction,
  OpenApi,
} from "@samchon/openapi";
import fs from "fs";
import OpenAI from "openai";
import typia from "typia";

import env from "./env.js";
import { checkApiKey } from "./internal/checkApiKey.js";

const main = async (): Promise<void> => {
  checkApiKey();

  // GET SWAGGER SCHEMA INFORMATION
  const document: OpenApi.IDocument = OpenApi.convert(
    await fetch("https://shopping-be.wrtn.ai/editor/swagger.json").then((r) =>
      r.json(),
    ),
  );

  // CONVERT TO LLM FUNCTION CALLING SCHEMA
  const app: IHttpLlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document,
    options: {
      reference: true,
    },
  });
  const page: IHttpLlmFunction<"chatgpt"> | undefined = app.functions.find(
    (func) =>
      func.path === "/shoppings/customers/sales" && func.method === "patch",
  );
  const sale: IHttpLlmFunction<"chatgpt"> | undefined = app.functions.find(
    (func) =>
      func.path === "/shoppings/customers/sales/{id}" && func.method === "get",
  );
  if (page === undefined || sale === undefined) {
    console.error("Operation not found");
    process.exit(-1);
  }

  // GENERATE
  await Promise.all(
    Object.entries({
      page,
      sale,
    }).map(async ([key, func]) => {
      const result: MainAgent.IResult = await MainAgent.execute(
        {
          type: "chatgpt",
          api: new OpenAI({
            apiKey: typia.assert<string>(env.OPENAI_API_KEY),
          }),
          model: typia.assert<OpenAI.ChatModel>(env.OPENAI_MODEL),
        },
        {
          ...func.output,
          $defs: func.parameters.$defs,
        },
      );
      await fs.promises.writeFile(
        `src/transform${key[0].toUpperCase()}${key.slice(1)}.ts`,
        result.transformTsCode,
        "utf8",
      );
    }),
  );
};
main().catch(console.error);
