import typia, { tags } from "typia";
import type * as IAutoView from "@autoview/interface";
type IShoppingSale = {
    section: IShoppingSection;
    seller: IShoppingSeller.IInvert;
    id: string & tags.Format<"uuid">;
    snapshot_id: string & tags.Format<"uuid">;
    latest: boolean;
    content: IShoppingSaleContent;
    categories: IShoppingChannelCategory.IInvert[];
    tags: string[];
    units: IShoppingSaleUnit[] & tags.MinItems<1>;
    created_at: string & tags.Format<"date-time">;
    updated_at: string & tags.Format<"date-time">;
    paused_at: null | (string & tags.Format<"date-time">);
    suspended_at: null | (string & tags.Format<"date-time">);
    opened_at: null | (string & tags.Format<"date-time">);
    closed_at: null | (string & tags.Format<"date-time">);
};
type IShoppingSection = {
    id: string & tags.Format<"uuid">;
    code: string;
    name: string;
    created_at: string & tags.Format<"date-time">;
};
namespace IShoppingSeller {
    export type IInvert = {
        type: "seller";
        member: IShoppingMember.IInvert;
        customer: IShoppingCustomer.IInvert;
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
namespace IShoppingCustomer {
    export type IInvert = {
        id: string & tags.Format<"uuid">;
        channel: IShoppingChannel;
        external_user: null | IShoppingExternalUser;
        href: string & tags.Format<"uri">;
        referrer: null | (string & tags.Format<"uri">) | (string & tags.MaxLength<0>);
        ip: (string & tags.Format<"ipv4">) | (string & tags.Format<"ipv6">);
        created_at: string & tags.Format<"date-time">;
    };
}
type IShoppingChannel = {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
    code: string;
    name: string;
};
type IShoppingExternalUser = {
    id: string & tags.Format<"uuid">;
    citizen: null | IShoppingCitizen;
    created_at: string & tags.Format<"date-time">;
    uid: string;
    application: string;
    nickname: string;
    data: any;
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
type IShoppingSaleContent = {
    id: string & tags.Format<"uuid">;
    title: string;
    format: "html" | "md" | "txt";
    body: string;
    files: IAttachmentFile[];
    thumbnails: IAttachmentFile[];
};
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
type IShoppingSaleUnit = {
    options: (IShoppingSaleUnitDescriptiveOption | IShoppingSaleUnitSelectableOption)[];
    stocks: IShoppingSaleUnitStock[] & tags.MinItems<1>;
    id: string & tags.Format<"uuid">;
    name: string;
    primary: boolean;
    required: boolean;
};
type IShoppingSaleUnitDescriptiveOption = {
    id: string & tags.Format<"uuid">;
    type: "string" | "number" | "boolean";
    name: string;
};
type IShoppingSaleUnitSelectableOption = {
    candidates: IShoppingSaleUnitOptionCandidate[] & tags.MinItems<1>;
    id: string & tags.Format<"uuid">;
    type: "select";
    name: string;
    variable: boolean;
};
type IShoppingSaleUnitOptionCandidate = {
    id: string & tags.Format<"uuid">;
    name: string;
};
type IShoppingSaleUnitStock = {
    id: string & tags.Format<"uuid">;
    name: string;
    price: IShoppingPrice;
    inventory: IShoppingSaleUnitStockInventory;
    choices: IShoppingSaleUnitStockChoice[];
};
type IShoppingPrice = {
    nominal: number & tags.Minimum<0>;
    real: number & tags.Minimum<0>;
};
type IShoppingSaleUnitStockInventory = {
    income: number & tags.Type<"int32">;
    outcome: number & tags.Type<"int32">;
};
type IShoppingSaleUnitStockChoice = {
    id: string & tags.Format<"uuid">;
    option_id: string & tags.Format<"uuid">;
    candidate_id: string & tags.Format<"uuid">;
};
type IAutoViewTransformerInputType = IShoppingSale;
export function transform($input: unknown): IAutoView.IAutoViewComponentProps {
    typia.assertGuard<IAutoViewTransformerInputType>($input);
    return visualizeData($input);
}



function visualizeData(input: IAutoViewTransformerInputType): IAutoView.IAutoViewComponentProps {
    // Helper function to extract needed fields from the sale; returns a processed plain object
    function transformSale(sale: IAutoViewTransformerInputType) {
        const content = sale.content || {};
        const seller = sale.seller || {};
        // Use optional chaining to get seller member nickname indication.
        const sellerName = seller.member?.nickname || "Unknown Seller";
        const thumbnailUrl = (content.thumbnails && content.thumbnails.length > 0)
            ? content.thumbnails[0].url
            : "";
        const categories = sale.categories || [];
        const tags = sale.tags || [];
        // Extract the real price from the first unit's first stock if available
        let priceReal = "";
        if (sale.units?.length && sale.units[0].stocks?.length && sale.units[0].stocks[0].price) {
            priceReal = sale.units[0].stocks[0].price.real.toString();
        }
        return {
            title: content.title || "Untitled Sale",
            body: content.body || "",
            thumbnailUrl,
            sellerName,
            categories,
            tags,
            createdAt: sale.created_at,
            priceReal,
        };
    }
    
    // Helper function to transform categories or tags into an array of chip objects with label and key.
    function transformChips(items: any[], itemKey: string): { label: string, key: string }[] {
        return items.map((item, index) => {
            // For categories, assume each item has a 'name' property; for tags, item is a string.
            const label = typeof item === "string" ? item : item.name;
            return { label, key: `${itemKey}-${index}` };
        });
    }

    // Process the input sale
    const processed = transformSale(input);
    const categoryChips = transformChips(processed.categories, "cat");
    const tagChips = transformChips(processed.tags, "tag");

    // Build individual component configuration objects.
    const titleComponent: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "h4",
        children: processed.title
    };

    const thumbnailComponent: IAutoView.IAutoViewImageProps = {
        type: "Image",
        src: processed.thumbnailUrl,
        alt: "Sale Thumbnail"
    };

    const descriptionComponent: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "body1",
        children: processed.body
    };

    const dividerComponent: IAutoView.IAutoViewDividerProps = {
        type: "Divider",
        orientation: "horizontal",
        variant: "dashed",
        color: "#ccc"
    };

    const sellerComponent: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "subtitle1",
        children: `Seller: ${processed.sellerName}`
    };

    // Create Chip components for categories
    const categoryChipComponents: IAutoView.IAutoViewChipProps[] = categoryChips.map(chip => {
        return {
            type: "Chip",
            label: chip.label
        };
    });
    // Wrap each chip into a StackedList item (each item has a children array of components)
    const categoryStackedListItem: IAutoView.IAutoViewStackedListProps["items"] = categoryChipComponents.map(chip => ({
        children: [chip]
    }));
    // StackedList for categories.
    const categoryStackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        gap: 8,
        items: categoryStackedListItem
    };

    // Create Chip components for tags
    const tagChipComponents: IAutoView.IAutoViewChipProps[] = tagChips.map(chip => {
        return {
            type: "Chip",
            label: chip.label
        };
    });
    const tagStackedListItem: IAutoView.IAutoViewStackedListProps["items"] = tagChipComponents.map(chip => ({
        children: [chip]
    }));
    const tagStackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        gap: 8,
        items: tagStackedListItem
    };

    const priceComponent: IAutoView.IAutoViewStatsProps = {
        type: "Stats",
        title: "Price",
        value: processed.priceReal
    };

    const creationDateComponent: IAutoView.IAutoViewTypographyProps = {
        type: "Typography",
        variant: "caption",
        children: `Created at: ${processed.createdAt}`
    };

    // Now aggregate all these components into a parent container.
    // We use a StackedList to group all elements together vertically.
    const parentStackedList: IAutoView.IAutoViewStackedListProps = {
        type: "StackedList",
        gap: 16,
        items: [
            { children: [titleComponent] },
            { children: [thumbnailComponent] },
            { children: [descriptionComponent] },
            { children: [dividerComponent] },
            { children: [sellerComponent] },
            { children: [categoryStackedList] },
            { children: [tagStackedList] },
            { children: [priceComponent] },
            { children: [creationDateComponent] }
        ]
    };

    return parentStackedList;
}
