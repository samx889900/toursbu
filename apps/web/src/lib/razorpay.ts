import Razorpay from "razorpay";

const globalForRazorpay = globalThis as unknown as {
  razorpay: Razorpay | undefined;
};

// Use dummy keys if env vars are missing so the build doesn't fail, 
// but it will fail on actual API calls.
export const razorpay =
  globalForRazorpay.razorpay ??
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
  });

if (process.env.NODE_ENV !== "production") globalForRazorpay.razorpay = razorpay;
