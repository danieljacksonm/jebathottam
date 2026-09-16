import { getAllProducts } from "@/lib/products";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Shop Car Wraps & Stickers",
  description:
    "Browse Raju Stickers premium car wraps — chrome, metallic, matte, carbon fiber, and solid colours. Search, filter, and sort the full catalogue.",
  path: "/shop",
  image: "/products/holographic-carbon.jpg",
});

type ShopPageProps = {
  searchParams: Promise<{ q?: string; focus?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getAllProducts();

  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <header className="mb-8 sm:mb-10 max-w-2xl">
        <p className="section-kicker">Catalogue</p>
        <h1 className="section-title text-[clamp(2.2rem,5vw,3.5rem)]">Shop Stickers</h1>
        <p className="section-sub mt-3">
          Premium wrapping films and vinyl finishes. Filter by category, price, and style.
        </p>
      </header>
      <ShopFilters
        products={products}
        initialQuery={params.q || ""}
        focusSearch={params.focus === "search"}
      />
    </div>
  );
}
