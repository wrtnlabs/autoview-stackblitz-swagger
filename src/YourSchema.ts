import { tags } from "typia";

export interface YourSchema {
  name: string;
  age: number & tags.Minimum<0> & tags.Maximum<100>;
  email: string & tags.Format<"email">;
  introduction: string;
  thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
}
