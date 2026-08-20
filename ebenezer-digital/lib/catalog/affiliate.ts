import { loadCatalogStore } from "./repository";
import type { Offer } from "@/app/catalog/types";

export function resolveOutboundUrl(offer: Offer): string {
  return offer.affiliateUrl || offer.url;
}

export function buildAffiliateRedirectPath(offerId: string): string {
  return `/catalog/go/${encodeURIComponent(offerId)}`;
}

export function findOffer(offerId: string): Offer | undefined {
  return loadCatalogStore().offers.find((o) => o.id === offerId);
}

export function discloseAffiliate(): string {
  return "Some links on Ebenezer Products are affiliate links. If you buy through them, we may earn a commission at no extra cost to you.";
}

export function merchantLabel(merchantId: string): string {
  return loadCatalogStore().merchants.find((m) => m.id === merchantId)?.name ?? merchantId;
}
