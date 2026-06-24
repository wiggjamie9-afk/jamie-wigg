import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, courseName, priceCents } = body;

    if (!userId || !courseId || !courseName || !priceCents) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseUrl = process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000";
    const successUrl = `${baseUrl}/course/${courseId}?success=true`;
    const cancelUrl = `${baseUrl}/course/${courseId}?canceled=true`;

    const { url, error } = await createCheckoutSession(
      userId,
      courseId,
      courseName,
      priceCents,
      successUrl,
      cancelUrl
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
