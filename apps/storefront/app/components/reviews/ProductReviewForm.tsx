import { Actions } from '@app/components/common/actions';
import { Button, SubmitButton } from '@app/components/common/buttons';
import { Form } from '@app/components/common/forms/Form';
import { FormError } from '@app/components/common/forms/FormError';
import { FieldTextarea } from '@app/components/common/forms/fields/FieldTextarea';
import { StoreOrderLineItem } from '@medusajs/types';
import { FetcherWithComponents, Link, useFetcher } from '@remix-run/react';
import { withYup } from '@remix-validated-form/with-yup';
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { ProductReviewAction } from '@app/routes/api.product-reviews';
import { ImageUploadWithPreview } from '@app/components/common/ImageUpload/ImageUploadWithPreview';
import { StarRating } from './StarRating';
import { FieldLabel } from '@app/components/common/forms/fields/FieldLabel';
import { StoreProductReview } from '@lambdacurry/medusa-plugins-sdk';
export interface ProductReviewFormValues {
  id?: string;
  rating?: number;
  content?: string;
  images?: MedusaImage[];
  line_item_id: string;
  order_id: string;
}

export interface MedusaImage {
  created_at: string;
  deleted_at: string;
  id: string;
  metadata: string;
  updated_at: string;
  url: string;
}

export interface ProductReviewFormProps {
  redirect?: string;
  onSuccess?: () => void;
  setEditing: (value: boolean) => void;
  productReview?: StoreProductReview;
  requestId?: string;
  lineItem: StoreOrderLineItem;
  orderId: string;
}

export const ProductReviewFormValidator = withYup(
  Yup.object().shape({
    id: Yup.string().optional(),
    line_item_id: Yup.string().required(),
    order_id: Yup.string().required(),
    rating: Yup.number().optional(),
    content: Yup.string().optional(),
  }),
);

export const ProductReviewForm: FC<ProductReviewFormProps> = ({
  setEditing,
  productReview,
  requestId,
  lineItem,
  orderId,
}) => {
  const isComplete = productReview?.id;

  const fetcher = useFetcher<{}>() as FetcherWithComponents<{}>;
  const product_id = lineItem?.variant?.product_id;

  const defaultValues = productReview
    ? { rating: productReview.rating, content: productReview.content, images: productReview.images }
    : { rating: 5, comment: '' };

  const formId = `product-review-form-${lineItem.id}`;

  const [ratingValue, setRatingValue] = useState<number>(defaultValues.rating);

  const existingImages = productReview?.images || [];

  return (
    <Form<ProductReviewFormValues, ProductReviewAction.UPSERT_PRODUCT_REVIEWS>
      id={formId}
      encType="multipart/form-data"
      method="post"
      action="/api/product-reviews"
      subaction={ProductReviewAction.UPSERT_PRODUCT_REVIEWS}
      fetcher={fetcher}
      validator={ProductReviewFormValidator}
      onSubmit={() => setEditing(false)}
      defaultValues={defaultValues}
    >
      <FormError className="mt-0" />
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h3 className="text-base text-gray-900">
            <Link to={`/products/${lineItem.variant?.product?.handle}`}>{lineItem.title}</Link>
          </h3>

          <p className="text-sm font-normal text-gray-500">{lineItem.variant?.title}</p>
        </div>

        <div>
          <FieldLabel htmlFor="rating">Select a rating</FieldLabel>
          <StarRating onChange={setRatingValue} value={ratingValue} />
        </div>
      </div>

      {isComplete && <input type="hidden" name="id" value={productReview.id} />}
      <input type="hidden" name="rating" value={ratingValue} />
      <input type="hidden" name="order_id" value={orderId} />
      <input type="hidden" name="line_item_id" value={lineItem.id} />
      {requestId && <input type="hidden" name="review_request_id" value={requestId} />}

      <ImageUploadWithPreview existingImages={existingImages as MedusaImage[]} className="mb-2 mt-6" />

      <FieldTextarea name="content" placeholder="Add your review" className="sm:col-span-12" />
      <Actions>
        {isComplete && <Button onClick={() => setEditing(false)}>Cancel</Button>}
        <SubmitButton>{isComplete ? 'Save' : 'Submit Review'}</SubmitButton>
      </Actions>
    </Form>
  );
};
