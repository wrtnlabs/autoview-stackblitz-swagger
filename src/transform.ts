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
    // Transform the input data to add an ageString property
    const processedData = {
        ...input,
        ageString: input.age?.toString() ?? ""
    };

    // Create the AutoView components based on the component plan
    const imageAvatar: IAutoView.IAutoViewImageAvatarProps = {
        src: processedData.thumbnail,
        name: processedData.name,
        type: "ImageAvatar"
    };

    const nameTypography: IAutoView.IAutoViewTypographyProps = {
        children: processedData.name,
        variant: "h4",
        type: "Typography"
    };

    const emailTypography: IAutoView.IAutoViewTypographyProps = {
        children: processedData.email,
        variant: "body1",
        type: "Typography"
    };

    const ageStats: IAutoView.IAutoViewStatsProps = {
        title: "Age",
        value: processedData.ageString,
        type: "Stats"
    };

    const divider: IAutoView.IAutoViewDividerProps = {
        orientation: "horizontal",
        variant: "solid",
        color: "gray",
        type: "Divider"
    };

    const introTypography: IAutoView.IAutoViewTypographyProps = {
        children: processedData.introduction,
        variant: "body2",
        type: "Typography"
    };

    // Aggregate the above components into a StackedList to represent multiple UI elements.
    // The first stacked item contains the profile header (avatar, name, email, age).
    // The second stacked item contains the divider and the introduction.
    const stackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        gap: 8, // gap between items
        items: [
            {
                children: [
                    imageAvatar,
                    nameTypography,
                    emailTypography,
                    ageStats
                ]
            },
            {
                children: [
                    divider,
                    introTypography
                ]
            }
        ]
    };

    return stackedList;
}
