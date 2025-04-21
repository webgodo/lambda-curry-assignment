import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Label, clx } from "@medusajs/ui";
import { PRODUCT_METADATA_KEYS } from "@lc/shared";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "../../sdk";

const ProductCustomizable = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const productId = product.id;

  // Determine if the product is customizable from metadata
  const isCustomizable =
    !!product.metadata?.[PRODUCT_METADATA_KEYS.IS_CUSTOMIZABLE];

  const { mutateAsync: updateProduct, isPending } = useMutation({
    mutationFn: (newValue: boolean) =>
      sdk.admin.product.update(productId, {
        metadata: {
          ...product.metadata,
          [PRODUCT_METADATA_KEYS.IS_CUSTOMIZABLE]: newValue ? true : undefined,
        },
      }),
    onSuccess() {
      window.location.reload();
    },
  });

  const handleButtonClick = async () => await updateProduct(!isCustomizable);

  return (
    <Container className="flex flex-col gap-4">
      <Heading level="h2">Customizable Product</Heading>

      <div
        className={clx("flex items-center gap-x-2", {
          "animate-pulse": isPending,
        })}
      >
        <Button
          onClick={handleButtonClick}
          disabled={isPending} // Disable button while updating
          variant={isCustomizable ? "primary" : "secondary"}
        >
          {isCustomizable ? "Disable custom message" : "Enable custom message"}
        </Button>
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductCustomizable;
