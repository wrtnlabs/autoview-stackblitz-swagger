import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
namespace IPageIShoppingSale {
    export type ISummary = {
        pagination: IPage.IPagination;
        data: IShoppingSale.ISummary[];
    };
}
namespace IPage {
    export type IPagination = {
        current: number & tags.Type<"int32">;
        limit: number & tags.Type<"int32">;
        records: number & tags.Type<"int32">;
        pages: number & tags.Type<"int32">;
    };
}
namespace IShoppingSale {
    export type ISummary = {
        section: IShoppingSection;
        seller: IShoppingSeller.ISummary;
        price_range: IShoppingSalePriceRange;
        id: string & tags.Format<"uuid">;
        snapshot_id: string & tags.Format<"uuid">;
        latest: boolean;
        content: IShoppingSaleContent.IInvert;
        categories: IShoppingChannelCategory.IInvert[];
        tags: string[];
        units: IShoppingSaleUnit.ISummary[] & tags.MinItems<1>;
        created_at: string & tags.Format<"date-time">;
        updated_at: string & tags.Format<"date-time">;
        paused_at: null | (string & tags.Format<"date-time">);
        suspended_at: null | (string & tags.Format<"date-time">);
        opened_at: null | (string & tags.Format<"date-time">);
        closed_at: null | (string & tags.Format<"date-time">);
    };
}
type IShoppingSection = {
    id: string & tags.Format<"uuid">;
    code: string;
    name: string;
    created_at: string & tags.Format<"date-time">;
};
namespace IShoppingSeller {
    export type ISummary = {
        type: "seller";
        member: IShoppingMember.IInvert;
        citizen: IShoppingCitizen;
        id: string & tags.Format<"uuid">;
        created_at: string & tags.Format<"date-time">;
    };
}
namespace IShoppingMember {
    export type IInvert = {
        id: string & tags.Format<"uuid">;
        nickname: string;
        emails: IShoppingMemberEmail[];
        created_at: string & tags.Format<"date-time">;
    };
}
type IShoppingMemberEmail = {
    id: string & tags.Format<"uuid">;
    value: string & tags.Format<"email">;
    created_at: string & tags.Format<"date-time">;
};
type IShoppingCitizen = {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
    mobile: string & tags.Pattern<"^[0-9]*$"> & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-mobile": true
    }>;
    name: string & tags.JsonSchemaPlugin<{
        "x-wrtn-payment-order-citizen": true
    }>;
};
type IShoppingSalePriceRange = {
    lowest: IShoppingPrice;
    highest: IShoppingPrice;
};
type IShoppingPrice = {
    nominal: number & tags.Minimum<0>;
    real: number & tags.Minimum<0>;
};
namespace IShoppingSaleContent {
    export type IInvert = {
        id: string & tags.Format<"uuid">;
        title: string;
        thumbnails: IAttachmentFile[];
    };
}
type IAttachmentFile = {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
    name: string & tags.MaxLength<255>;
    extension: null | (string & tags.MinLength<1> & tags.MaxLength<8>);
    url: string & tags.Format<"uri"> & tags.ContentMediaType<"image/*">;
};
namespace IShoppingChannelCategory {
    export type IInvert = {
        parent: null | IShoppingChannelCategory.IInvert;
        id: string & tags.Format<"uuid">;
        code: string;
        parent_id: null | (string & tags.Format<"uuid">);
        name: string;
        created_at: string & tags.Format<"date-time">;
    };
}
namespace IShoppingSaleUnit {
    export type ISummary = {
        price_range: IShoppingSalePriceRange;
        id: string & tags.Format<"uuid">;
        name: string;
        primary: boolean;
        required: boolean;
    };
}
type IAutoViewTransformerInputType = IPageIShoppingSale.ISummary;
export function transform($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Destructure the main input properties: pagination and sale records.
    const { pagination, data: sales } = input;

    // Transform each sale record into a StackedList item.
    const saleItems = sales.map((sale) => {
        // Safely extract the sale title.
        const title = sale.content && sale.content.title ? sale.content.title : "Untitled Sale";
        // Safely get the thumbnail URL from the first attachment, if available.
        const thumbnail =
            sale.content && sale.content.thumbnails && sale.content.thumbnails.length > 0
                ? sale.content.thumbnails[0].url
                : "";
        // Extract the real price values from price_range and provide defaults if absent.
        const priceLow = sale.price_range && sale.price_range.lowest && sale.price_range.lowest.real ? sale.price_range.lowest.real : 0;
        const priceHigh = sale.price_range && sale.price_range.highest && sale.price_range.highest.real ? sale.price_range.highest.real : 0;
        const priceDisplay = `$${priceLow} - $${priceHigh}`;

        // Build an array of AutoView component props for this sale's card.
        const saleComponents: IAutoView.IAutoViewComponentProps[] = [];
        
        // Add Typography for the sale title.
        saleComponents.push({
            type: "Typography",
            variant: "h6",
            children: title,
        });
        
        // Conditionally add an Image component if we have a thumbnail URL.
        if (thumbnail) {
            saleComponents.push({
                type: "Image",
                src: thumbnail,
                alt: title,
            });
        }
        
        // Add a Stats component for the price range.
        saleComponents.push({
            type: "Stats",
            title: "Price Range",
            value: priceDisplay,
            valuePrefix: "$",
        });
        
        // Add a Divider to visually separate sale cards.
        saleComponents.push({
            type: "Divider",
            orientation: "horizontal",
            variant: "dotted",
        });
        
        // Return an item in the StackedList with the composed children.
        return { children: saleComponents };
    });

    // Create a Stats component for pagination information.
    const paginationStats: IAutoView.IAutoViewComponentProps = {
        type: "Stats",
        title: "Page Information",
        value: `Page ${pagination.current} of ${pagination.pages} (${pagination.records} records)`,
    };

    // Combine pagination stats and the sales cards into a single StackedList.
    const output: IAutoView.IAutoViewComponentProps = {
        type: "StackedList",
        gap: 16,
        items: [
            // First item contains the pagination stats.
            { children: [paginationStats] },
            // Then add each sale card item.
            ...saleItems,
        ],
    };

    return output;
}
