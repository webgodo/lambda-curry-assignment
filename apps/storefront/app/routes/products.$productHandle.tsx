import { redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ProductTemplate } from '@app/templates/ProductTemplate';
import { getMergedProductMeta } from '@libs/util/products';
import { fetchProducts } from '@libs/util/server/products.server';
import { StoreProduct } from '@medusajs/types';
import { fetchProductReviews, fetchProductReviewStats } from '@libs/util/server/data/product-reviews.server';
import { StoreListProductReviewsResponse, StoreListProductReviewStatsResponse } from '@lambdacurry/medusa-plugins-sdk';

export const loader = async (args: LoaderFunctionArgs) => {
  const { products } = await fetchProducts(args.request, {
    handle: args.params.productHandle,
    fields: '*categories',
  }).catch((e) => {
    return { products: [] };
  });

  if (!products.length) {
    return redirect('/404');
  }

  const product = products[0];

  const productReviews = await fetchProductReviews({
    product_id: product.id,
    // can use status: (pending, approved, flagged)[] to get reviews by status // default is approved
    offset: 0,
    limit: 10,
  }).catch((e) => {
    console.log('🚀 ~ loader ~ e:', e);
    console.error('\n\n\nError fetching product reviews', e);
    return { product_reviews: [], count: 0, offset: 0, limit: 0 } as StoreListProductReviewsResponse;
  });

  const productReviewStats = await fetchProductReviewStats({
    product_id: product.id,
    offset: 0,
    limit: 10,
  }).catch((e) => {
    console.log('🚀 ~ loader ~ e:', e);
    console.error('\n\n\nError fetching product review stats', e);
    return { product_review_stats: [], count: 0, offset: 0, limit: 0 } as StoreListProductReviewStatsResponse;
  });

  return { product, productReviews, productReviewStats };
};

export type ProductPageLoaderData = typeof loader;

export const meta: MetaFunction<ProductPageLoaderData> = getMergedProductMeta;

export default function ProductDetailRoute() {
  const { product, productReviews, productReviewStats } = useLoaderData<ProductPageLoaderData>();

  return (
    <ProductTemplate
      product={product}
      productReviews={productReviews.product_reviews}
      productReviewStats={productReviewStats.product_review_stats[0]}
    />
  );
}
