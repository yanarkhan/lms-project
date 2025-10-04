import apiInstance from "../utils/Axios";
import type { SignInFormValues, SignUpFormValues } from "../utils/ZodSchema";

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

export type PostSignInData = {
  name: string;
  email: string;
  token: string;
  role: "manager" | "student";
};

export async function postSignIn(
  payload: SignInFormValues
): Promise<PostSignInData> {
  const { data } = await apiInstance.post("/sign-in", payload);

  const body = (data?.data ?? data) as Partial<PostSignInData>;

  if (!body?.token || !body?.email || !body?.name || !body?.role) {
    console.error("Unexpected /sign-in response:", data);
    throw new Error("Invalid sign-in response from server.");
  }

  return {
    name: body.name,
    email: body.email,
    token: body.token,
    role: body.role,
  };
}
