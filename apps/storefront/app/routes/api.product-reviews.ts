import { FormValidationError } from '@libs/util/validation/validation-error';
import { handleAction, type ActionHandler } from '@libs/util/handleAction.server';
import type { ActionFunctionArgs, NodeOnDiskFile } from '@remix-run/node';

import { upsertProductReviews } from '@libs/util/server/data/product-reviews.server';
import { StoreUpsertProductReviewsDTO } from '@lambdacurry/medusa-plugins-sdk';
import { upsertProductReviewsValidator } from '@app/components/reviews/product-form-validators';
import { sdk } from '@libs/util/server/client.server';

export enum ProductReviewAction {
  UPSERT_PRODUCT_REVIEWS = 'upsertProductReviews',
}

const uploadImages = async (images: NodeOnDiskFile | NodeOnDiskFile[] | null | undefined): Promise<string[]> => {
  if (!images) return [];
  if (images && !Array.isArray(images)) images = [images];
  if (!Array.isArray(images)) return [];
  if (!images?.length) return [];
  const response = await sdk.store.productReviews.uploadImages(images as unknown as File[]);
  if (!response?.uploads) return [];
  return Array.isArray(response.uploads) ? response.uploads.map((i) => i.url) : [response.uploads.url];
};

const upsertProductReviewsHandler: ActionHandler<unknown> = async (
  data: Omit<StoreUpsertProductReviewsDTO['reviews'][number], 'images'> & { images: NodeOnDiskFile[] },
  actionArgs,
) => {
  const { request } = actionArgs;
  const { order_id, order_line_item_id, rating, content, images } = data;

  const result = await upsertProductReviewsValidator.validate({
    order_id,
    order_line_item_id,
    rating,
    content,
  });
  if (result.error) throw new FormValidationError(result.error);

  try {
    if ('__rvfInternalFormId' in data) delete data.__rvfInternalFormId;

    const imageUrls = await uploadImages(images ?? []);

    const { product_reviews } = await upsertProductReviews(request, {
      reviews: [
        {
          order_id,
          order_line_item_id,
          rating,
          content,
          images: imageUrls,
        },
      ],
    });

    return product_reviews;
  } catch (error: any) {
    if (error instanceof Response) throw error;
    if (error instanceof FormValidationError) throw error;

    console.error('product reviews error', error);

    throw new FormValidationError({
      fieldErrors: {
        formError: 'Something went wrong when creating or updating your product reviews.',
      },
    });
  }
};

const actions = {
  upsertProductReviews: upsertProductReviewsHandler,
};

export async function action(actionArgs: ActionFunctionArgs) {
  return await handleAction({ actionArgs, actions });
}
