import { LINE_ITEM_METADATA_KEYS } from "@lc/shared";
import { StoreCartLineItem, StoreOrderLineItem } from "@medusajs/types";
import { FC } from "react";

interface CartLineItemCustomMessageViewProps {
  item: StoreCartLineItem | StoreOrderLineItem;
}

export const CartLineItemCustomMessageView: FC<
  CartLineItemCustomMessageViewProps
> = ({ item }) => {
  const customMessage = item.metadata?.[
    LINE_ITEM_METADATA_KEYS.CUSTOM_MESSAGE
  ] as string;

  if (!customMessage) return null;

  return (
    <p className="bg-yellow-50 rounded-md text-sm mt-0.5">
      <span className="text-gray-500">Message: </span>
      <strong className="text-teal-900/70">{customMessage}</strong>
    </p>
  );
};
