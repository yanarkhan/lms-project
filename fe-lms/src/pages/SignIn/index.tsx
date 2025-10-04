import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { type SignInFormValues, signInSchema } from "../../utils/ZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postSignIn, type PostSignInData } from "../../services/AuthService";
import type { AxiosError } from "axios";
import { STORAGE_KEY } from "../../utils/Const";
import secureLocalStorage from "react-secure-storage";

export const SignInPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const { isPending, mutateAsync } = useMutation<
    PostSignInData,
    AxiosError<{ message?: string }>,
    SignInFormValues
  >({ mutationFn: (vars) => postSignIn(vars) });

  const onSubmit = async (form: SignInFormValues) => {
    try {
      const res = await mutateAsync(form);

      secureLocalStorage.setItem(STORAGE_KEY, res);

      navigate(res.role === "manager" ? "/manager" : "/student");
    } catch (err) {
      const ax = err as AxiosError<{ message?: string }>;

      const serverMsg =
        ax.response?.data?.message ??
        (ax.response?.status === 401
          ? "Incorrect email or password."
          : ax.response?.status === 403
          ? "Account not verified (transaction not successful)."
          : "Failed to log in. Please try again.");

      setError("root", { type: "server", message: serverMsg });
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <section className="relative flex flex-col flex-1 p-[10px]">
      <div className="absolute w-[calc(100%-20px)] min-h-[calc(100vh-20px)] h-[calc(100%-20px)] bg-[#060A23] -z-10 rounded-[20px]">
        <img
          src="/assets/images/backgrounds/background-glow.png"
          className="absolute bottom-0 transform -translate-x-1/2 left-1/2"
          alt=""
        />
      </div>
      <nav className="flex items-center justify-between p-[30px]">
        <Navbar />
        <div className="flex items-center gap-3">
          <Link to="#">
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
              <span className="font-semibold text-white">My Dashboard</span>
            </div>
          </Link>
          <Link to="/manager/sign-up">
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]">
              <span className="font-semibold text-white">Sign Up</span>
            </div>
          </Link>
        </div>
      </nav>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[400px] h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A] m-auto"
        noValidate
      >
        <div>
          <h1 className="font-bold text-[26px] leading-[39px] text-white">
            Welcome Back!
          </h1>
          <p className="text-[#6B6C7F]">Manage your employees easily</p>
        </div>

        <hr className="border-[#262A56]" />

        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 focus-within:border-[#8661EE] focus-within:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
            <img
              src="/assets/images/icons/sms-white.svg"
              className="w-6 h-6 flex shrink-0"
              alt="icon"
            />
            <input
              type="email"
              id="email"
              className="appearance-none outline-none !bg-transparent w-full font-semibold text-white placeholder:font-normal placeholder:text-[#6B6C7F]"
              placeholder="Write your email address"
              {...register("email")}
            />
          </div>
          {errors.email?.message && (
            <p role="alert" className="ml-3 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 focus-within:border-[#8661EE] focus-within:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
            <img
              src="/assets/images/icons/key-white.svg"
              className="w-6 h-6 flex shrink-0"
              alt="icon"
            />
            <input
              type="password"
              id="password"
              className="appearance-none outline-none !bg-transparent w-full font-semibold text-white placeholder:font-normal placeholder:text-[#6B6C7F]"
              placeholder="Type your secure password"
              {...register("password")}
            />
          </div>
          {errors.password?.message && (
            <p role="alert" className="ml-3 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
          <div className="flex justify-end mt-[10px]">
            <Link
              to="#"
              className="text-sm leading-[21px] text-[#662FFF] hover:underline"
            >
              Forgot Password
            </Link>
          </div>
        </div>

        {/* Server error (root) */}
        {errors.root?.message && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm px-3 py-2"
          >
            {errors.root.message}
          </div>
        )}

        <hr className="border-[#262A56]" />

        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full rounded-full border p-[14px_20px] text-center font-semibold text-white bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]"
        >
          {isSubmitting || isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </section>
  );
};
