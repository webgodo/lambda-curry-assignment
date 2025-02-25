import { withYup } from '@remix-validated-form/with-yup';
import * as Yup from 'yup';

const productReviewSchema = Yup.object({
  order_id: Yup.string(),
  line_item_id: Yup.string(),
  rating: Yup.number().transform((value) => Number(value)),
  content: Yup.string(),
});

export const upsertProductReviewsValidator = withYup(productReviewSchema);
