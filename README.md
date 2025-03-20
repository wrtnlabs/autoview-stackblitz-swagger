# AutoView Playground
Modify [`src/YourSchema.ts`](./src/YourSchema.ts) type and run `npm run generate` command.

Then `@autoview` will generate frontend rendering code for the `YourSchema` type, and the newly generated code would be written in the [`src/transform.ts`](./src/transform.ts) file. Also, following the changed interface type, website of right side would be automatically updated too.

If you want to see how to utilize such frontend automation tool, look at the [`src/generate.ts`](./src/generate.ts) file.