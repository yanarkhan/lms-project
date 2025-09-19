import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useForm } from "react-hook-form";
import { type SignUpFormValues, signUpSchema } from "../../utils/ZodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Pricing } from "./Pricing";

export const SignUpPage = () => {
  const [dataSignUp, setDataSignUp] = useState<SignUpFormValues | null>(null);
  const [mode, setMode] = useState<"AUTH" | "PRICING">("AUTH");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Submit: ", data);
    setDataSignUp(data);
    setMode("PRICING");
  };

  return (
    <>
      {mode === "AUTH" ? (
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
              <Link to="/manager/sign-in">
                <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
                  <span className="font-semibold text-white">My Dashboard</span>
                </div>
              </Link>
              <Link to="#">
                <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]">
                  <span className="font-semibold text-white">Sign Up</span>
                </div>
              </Link>
            </div>
          </nav>

          <div className="flex items-center justify-center gap-[109px] my-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-[400px] h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A]"
              noValidate
            >
              <div>
                <h2 className="font-bold text-[26px] leading-[39px] text-white">
                  Sign Up
                </h2>
                <p className="text-[#6B6C7F]">Manage your employees easily</p>
              </div>
              <hr className="border-[#262A56]" />

              <div className="space-y-2">
                <div className="flex items-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 focus-within:border-[#8661EE] focus-within:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
                  <img
                    src="/assets/images/icons/user-octagon-white.svg"
                    className="w-6 h-6 flex shrink-0"
                    alt="icon"
                  />
                  <input
                    type="text"
                    id="name"
                    className="appearance-none outline-none !bg-transparent w-full font-semibold text-white placeholder:font-normal placeholder:text-[#6B6C7F]"
                    placeholder="Write your complete name"
                    {...register("name")}
                  />
                </div>
                {errors.name?.message && (
                  <p role="alert" className="text-red-500 text-xs ml-3">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-500 text-xs ml-3">
                    {errors.email.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-500 text-xs ml-3">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <hr className="border-[#262A56]" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full border p-[14px_20px] text-center font-semibold text-white bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]"
              >
                {isSubmitting ? "Submiting..." : "Sign Up Now"}
              </button>
            </form>

            <div className="flex flex-col gap-[30px]">
              <h1 className="font-extrabold text-[46px] leading-[69px] text-white">
                Sign Up & Enhance <br /> Employees Skills
              </h1>
              <p className="text-lg leading-[32px] text-white">
                We delivery robust features to anyone <br /> unconditionally so
                they can grow bigger.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <Pricing data={dataSignUp} />
      )}
    </>
  );
};
