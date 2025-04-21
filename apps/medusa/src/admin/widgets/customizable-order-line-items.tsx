import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";
import { LINE_ITEM_METADATA_KEYS } from "@lc/shared";

const CustomizableOrderLineItems = ({
  data,
}: DetailWidgetProps<AdminOrder>) => {
  console.log(data);

  const filteredItems =
    data?.items?.filter(
      (item) => !!item.metadata?.[LINE_ITEM_METADATA_KEYS.CUSTOM_MESSAGE]
    ) || [];

  if (!filteredItems.length) return null;

  return (
    <Container className="gap-4 flex flex-col">
      <Heading>Order items with custom message</Heading>

      <table>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="flex items-start gap-x-4 text-ui-fg-subtle">
                  <div className="bg-ui-bg-component border-ui-border-base flex items-center justify-center overflow-hidden rounded border h-8 w-6">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={`Thumbnail for ${item.variant_title}`}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium font-sans txt-compact-small text-ui-fg-base">
                      {item.variant_title}
                    </p>
                    <p className="font-normal font-sans txt-small">
                      Default option value
                    </p>
                  </div>
                </div>
              </td>
              <td className="pl-10">
                <p className="flex gap-2 items-center">
                  <span className="text-xs">Message:</span>
                  <span className="text-sm bg-ui-bg-subtle px-2 rounded-md">
                    {(item.metadata?.[
                      LINE_ITEM_METADATA_KEYS.CUSTOM_MESSAGE
                    ] as string) ?? ""}
                  </span>
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.after",
});

export default CustomizableOrderLineItems;
