import { tags } from "typia";

/**
 * Membership information.
 */
export interface YourSchema {
  /**
   * Name of the member.
   */
  name: string;

  /**
   * Current age.
   */
  age: number & tags.Minimum<0> & tags.Maximum<100>;

  /**
   * Email address
   */
  email: string & tags.Format<"email">;

  /**
   * Introduction written by the member.
   *
   * Its format is Markdown, and there is no restriction on the length.
   */
  introduction: string;

  /**
   * Thumbnail picture of the member.
   */
  thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
}
