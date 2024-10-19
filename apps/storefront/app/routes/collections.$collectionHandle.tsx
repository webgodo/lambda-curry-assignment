import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { sdk } from '@libs/util/server/client.server';
import { Container } from '@app/components/common/container';
import { getSelectedRegion } from '@libs/util/server/data/regions.server';
import { getCollectionsList } from '@libs/util/server/data/collections.server';
import { PageHeading } from '@app/components/sections/PageHeading';
import clsx from 'clsx';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const region = await getSelectedRegion(request.headers);
  const handle = params.collectionHandle as string;

  const { collections } = await getCollectionsList();

  const collection = collections?.find((collection) => collection.handle === handle);

  if (!collection) {
    throw redirect('/products');
  }

  const { products, count, limit, offset } = await sdk.store.product.list({
    region_id: region?.id,
    collection_id: collection.id,
  });

  return { products, count, limit, offset, collections, collection };
};

export type ProductCollectionRouteLoader = typeof loader;

export default function ProductCollectionRoute() {
  const data = useLoaderData<ProductCollectionRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, collections, collection } = data;

  return (
    <Container className="pb-16">
      {collections.length > 1 && (
        <div className="flex flex-col w-full items-center">
          <div className="flex-1">
            <div className="inline-flex gap-5 text-4xl font-italiana border-b border-primary my-5">
              {collections.map((collection) => (
                <NavLink
                  to={`/collections/${collection.handle}`}
                  key={collection.id}
                  className={({ isActive }) =>
                    clsx('h-full p-4', {
                      'font-bold border-b-2 border-primary': isActive,
                      '!border-none active:': !isActive,
                    })
                  }
                >
                  {collection.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <PageHeading className="w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet my-24 font-normal lg:font-normal">
        {collection.title}
      </PageHeading>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <ProductListWithPagination
            products={products}
            paginationConfig={{ count, offset, limit }}
            context="products"
          />
        </div>
      </div>
    </Container>
  );
}
