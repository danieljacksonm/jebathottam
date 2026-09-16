import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <p className="section-kicker">Edit</p>
      <h1 className="font-display text-4xl mt-1 mb-8">{product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
