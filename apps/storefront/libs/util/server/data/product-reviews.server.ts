import { sdkCache } from '@libs/util/server/client.server';
import cachified from '@epic-web/cachified';
import { MILLIS } from '../cache-builder.server';
import { withAuthHeaders } from '../auth.server';

import {
  MedusaPluginsSDK,
  StoreListProductReviewsQuery,
  StoreListProductReviewStatsQuery,
  StoreUpsertProductReviewsDTO,
} from '@lambdacurry/medusa-plugins-sdk';

const sdk = new MedusaPluginsSDK({
  baseUrl: 'http://localhost:9000',
  publishableKey: 'pk_3fc12123016bcb734099cc0219334ca49b8df94564b4f65be359398be1325e33',
  auth: {
    type: 'session',
  },
});

export const fetchProductReviews = async (query: Partial<StoreListProductReviewsQuery> = {}) => {
  return await cachified({
    key: `product-reviews-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return await sdk.store.productReviews.list({
        ...query,
        offset: query.offset ?? 0,
        limit: query.limit ?? 10,
      });
    },
  });
};

export const fetchProductReviewStats = async (query: StoreListProductReviewStatsQuery = { offset: 0, limit: 10 }) => {
  return await cachified({
    key: `product-review-stats-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return await sdk.store.productReviews.listStats(query);
    },
  });
};

export const upsertProductReviews = withAuthHeaders(
  async (request, authHeaders, data: StoreUpsertProductReviewsDTO) => {
    return await sdk.store.productReviews.upsert(data, authHeaders);
  },
);
