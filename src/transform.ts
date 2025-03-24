import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
type IAutoViewTransformerInputType = {
    name: string;
    age: number & tags.Minimum<0> & tags.Maximum<100>;
    email: string & tags.Format<"email">;
    introduction: string;
    thumbnail: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
export function transform($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Create an ImageAvatar component using thumbnail and name from the input data
    const avatar: IAutoView.IAutoViewImageAvatarProps = {
        type: "ImageAvatar",
        src: input.thumbnail,
        name: input.name,
        size: 40
    };

    // Create a Typography component for the member's name with variant "h4"
    const nameTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        children: input.name,
        variant: "h4"
    };

    // Create a Stats component to display the age, converting the number to a string
    const ageStats: IAutoView.IAutoViewStatsProps = {
        type: "Stats",
        title: "Age",
        value: String(input.age)
    };

    // Create a Typography component for the email with variant "body2" and gray color
    const emailTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        children: input.email,
        variant: "body2",
        color: "gray"
    };

    // Create a Typography component for the introduction with variant "body1"
    const introTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        children: input.introduction,
        variant: "body1"
    };

    // Combine all components into a single vertical list (StackedList)
    // This allows the overall output to be a single IAutoViewComponentProps
    const stackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        gap: 8,  // Optional: gap between list items
        items: [
            {
                // Group all components in a single stacked list item.
                // This mirrors the layout of the React fragment in the component plan.
                children: [avatar, nameTypography, ageStats, emailTypography, introTypography]
            }
        ]
    };

    return stackedList;
}
