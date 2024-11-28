import stripe from "stripe";

export const createCheckout = async (req, res) => {
  const { items, success_url, cancel_url } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ message: "No items in the cart" });

  const stripeSession = stripe(process.env.STRIPE_SECRET_KEY);
  // const YOUR_DOMAIN = `${req.protocol}://${req.get("host")}`;

  const session = await stripeSession.checkout.sessions.create({
    line_items: items,
    //       [
    //   {
    //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    //     price: "price_1QKJxSE0BKf8PKrXwjyyFG5v",
    //     quantity: 1,
    //   },
    // ],
    mode: "payment",
    success_url: `${success_url}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url,
  });

  // res.redirect(303, session.url);
  res.status(200).json({ url: session.url, sessionId: session.id });
};

export const verifyCheckoutSession = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ message: "No session id provided" });

  const stripeSession = stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripeSession.checkout.sessions.retrieve(sessionId);
  res.status(200).json({
    id: session.id,
    paymentStatus: session.payment_status,
    paymentMethod: session.payment_method,
    paymentType: session.payment_type,
    paymentStatusTransitions: session.payment_status_transitions,
    currency: session.currency,
    customerDetalis: session.customer_details,
    createdDate: session.created,
    amountTotal: session.amount_total,
    totalDetails: session.total_details,
  });
};
