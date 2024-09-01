import { loadStripe } from "@stripe/stripe-js";
import { stringifyCookie } from "next/dist/compiled/@edge-runtime/cookies";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  }

  return stripePromise;
};

export default getStripe;
