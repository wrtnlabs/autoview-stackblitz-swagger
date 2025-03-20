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
    // Helper function to transform age from number to string
    function transformAge(age: number): string {
        return age.toString();
    }

    // Process the input data and perform necessary transformation
    const processedData = {
        name: input.name,
        age: transformAge(input.age),
        email: input.email,
        introduction: input.introduction,
        thumbnail: input.thumbnail
    };

    // Create props for the AutoViewImageAvatar component
    const imageAvatar: IAutoView.IAutoViewImageAvatarProps = {
        type: "ImageAvatar",
        src: processedData.thumbnail,
        name: processedData.name,
        size: 40
    };

    // Create props for the AutoViewTypography component (for showing the user's name)
    const nameTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "h4",
        children: processedData.name
    };

    // Create props for the AutoViewTypography component (for showing the user's email)
    const emailTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "caption",
        color: "#666",
        children: processedData.email
    };

    // Create props for the AutoViewDivider component to separate sections
    const divider: IAutoView.IAutoViewDividerProps = {
        type: "Divider",
        orientation: "horizontal",
        variant: "dotted",
        color: "#ccc"
    };

    // Create props for the AutoViewStats component to display the age as a statistic
    const stats: IAutoView.IAutoViewStatsProps = {
        type: "Stats",
        title: "Age",
        value: processedData.age,
        precision: 0
    };

    // Create props for the AutoViewTypography component (for the user's introduction)
    const introductionTypography: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "body1",
        children: processedData.introduction
    };

    // Wrap individual components into a single StackedList to represent the entire visualization
    const stackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        items: [
            { children: [ imageAvatar ] },
            { children: [ nameTypography ] },
            { children: [ emailTypography ] },
            { children: [ divider ] },
            { children: [ stats ] },
            { children: [ introductionTypography ] }
        ]
    };

    return stackedList;
}
