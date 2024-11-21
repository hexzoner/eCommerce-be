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
    success_url,
    cancel_url,
  });

  // res.redirect(303, session.url);
  res.status(200).json({ url: session.url });
};
