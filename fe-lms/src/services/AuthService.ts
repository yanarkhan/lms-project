import apiInstance from "../utils/Axios";
import type { SignUpFormValues } from "../utils/ZodSchema";

export type PostSignUpResponse = { midtrans_payment_url: string };

export async function postSignUp(
  payload: SignUpFormValues
): Promise<PostSignUpResponse> {
  const { data } = await apiInstance.post("/sign-up", payload);

  const url =
    (data?.midtrans_payment_url as string | undefined) ??
    (data?.data?.midtrans_payment_url as string | undefined);

  if (!url || typeof url !== "string") {
    console.error("Unexpected /sign-up response:", data);
    throw new Error("Payment URL missing in API response.");
  }
  return { midtrans_payment_url: url };
}
