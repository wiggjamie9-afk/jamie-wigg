import Stripe from "stripe";

const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"] || "", {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession(
  userId: string,
  courseId: string,
  courseName: string,
  priceCents: number,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string | null; error?: string }> {
  try {
    if (!priceCents || priceCents <= 0) {
      return { url: null, error: "Invalid price" };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseName,
              description: `Access to course`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        course_id: courseId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { url: null, error: String(error) };
  }
}

export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Stripe session retrieval error:", error);
    return null;
  }
}
