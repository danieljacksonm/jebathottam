import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <p className="section-kicker">New</p>
      <h1 className="font-display text-4xl mt-1 mb-8">Add a finish</h1>
      <ProductForm />
    </div>
  );
}
