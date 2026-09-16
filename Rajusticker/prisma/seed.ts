import { PrismaClient } from "@prisma/client";
import { catalogProducts } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const product of catalogProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        tradePrice: Math.round(product.price * 0.9),
        currency: "INR",
        imageUrl: product.images[0],
        imagesJson: JSON.stringify(product.images),
        category: product.category,
        categoriesJson: JSON.stringify(product.categories),
        tagsJson: JSON.stringify(product.tags),
        keywordsJson: JSON.stringify(product.keywords),
        sku: product.sku,
        brand: product.brand,
        material: product.material,
        finish: product.finish,
        finishLabel: product.finishLabel,
        color: product.color,
        adhesive: product.adhesive,
        thickness: product.thickness,
        stock: product.stock,
        featured: product.featured,
        bestSeller: product.bestSeller,
        newArrival: product.newArrival,
        published: true,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        altText: product.altText,
        applicationJson: JSON.stringify(product.applicationInstructions),
        careJson: JSON.stringify(product.careInstructions),
        detailsJson: JSON.stringify(product.details),
        faqJson: JSON.stringify(product.faq),
        sizes: {
          create: product.sizes.map((size) => ({
            sizeKey: size.id,
            label: size.label,
            widthCm: size.widthCm,
            lengthM: size.lengthM,
            priceMultiplier: size.priceMultiplier,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
