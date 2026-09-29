import { prisma } from "@/lib/prisma";

export type DocumentPrefix = "ENQ" | "QTN" | "INV";

export async function nextDocumentNumber(prefix: DocumentPrefix) {
  const year = new Date().getFullYear();
  const id = `${prefix}-${year}`;
  const value = await prisma.$transaction(async (tx) => {
    await tx.documentSequence.upsert({
      where: { id },
      create: { id, lastValue: 0 },
      update: {},
    });
    const updated = await tx.documentSequence.update({
      where: { id },
      data: { lastValue: { increment: 1 } },
    });
    return updated.lastValue;
  });
  return `${id}-${String(value).padStart(4, "0")}`;
}
