import { NextRequest, NextResponse } from "next/server";
import { createEnrollment } from "@/lib/courses";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"] || "";

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"] || "", {
      apiVersion: "2023-10-16" as any,
    });
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const userId = session.client_reference_id;
      const courseId = session.metadata?.["course_id"];

      if (!userId || !courseId) {
        console.error("Missing userId or courseId in session metadata");
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      // Create enrollment record
      const enrollment = await createEnrollment(userId, courseId, session.payment_intent as string);

      if (!enrollment) {
        console.error("Failed to create enrollment");
        return NextResponse.json(
          { error: "Failed to create enrollment" },
          { status: 500 }
        );
      }

      console.log(`Enrollment created for user ${userId} in course ${courseId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
