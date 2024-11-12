import stripe from "stripe";

export const stripePayment = async (req, res) => {
  const items = req.body;

  const YOUR_DOMAIN = `${req.protocol}://${req.get("host")}`;

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    //       [
    //   {
    //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    //     price: "price_1QKJxSE0BKf8PKrXwjyyFG5v",
    //     quantity: 1,
    //   },
    // ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
};
