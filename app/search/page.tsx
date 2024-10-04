import { ProductCard } from "@/app/components/product";
import { unstable_noStore as noStore } from "next/cache";
//import { getAllProducts } from "@lib/services";
import { fetchProducts } from "@lib/services/prismaServices";

async function getSearchProducts(q: string) {
  noStore();

  const { products } = await fetchProducts({ searchKey: q });

  return {
    products,
    found: !!products?.length,
    q: typeof q === "string" ? q : "",
  };
}

const SORT = {
  Name: "Trending",
  latest: "Latest arrivals",
  price: " Low to high",
};
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const { products, found, q } = await getSearchProducts(query);

  const perPage = 2;
  const maxPage = Math.ceil(products?.length / perPage);

  return (
    <div className="relative flex flex-col py-16 px-8 gap-3">
      <div className=" text-xl mx-auto md:mx-24">
        {found ? (
          <span className="text-primary-700">
            Showing {products?.length} results{" "}
            {q && (
              <strong>
                for "<span className="font-semibold">{q}</span>"
              </strong>
            )}
          </span>
        ) : (
          <span>
            There are no products that match{" "}
            <strong>
              "<span className="font-semibold">{q}</span>"
            </strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 mx-auto md:mx-24 lg:grid-cols-3 ">
        {products?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
