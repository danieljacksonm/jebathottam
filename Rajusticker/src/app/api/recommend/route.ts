import { recommendSchema } from "@/lib/validation";
import { getRecommendations } from "@/lib/recommendations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = recommendSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid recommendation request" }, { status: 400 });
    }

    const result = await getRecommendations(parsed.data);
    return Response.json({
      source: result.source,
      intent: result.intent,
      message: result.message,
      products: result.products,
    });
  } catch {
    return Response.json({ error: "Unable to generate recommendations" }, { status: 500 });
  }
}
