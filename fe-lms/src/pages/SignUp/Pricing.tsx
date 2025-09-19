import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { type SignUpFormValues } from "../../utils/ZodSchema";
import { useMutation } from "@tanstack/react-query";
import {
  postSignUp,
  type PostSignUpResponse,
} from "../../services/AuthService";
import { AxiosError } from "axios";
import { useState } from "react";

interface PricingProps {
  data: SignUpFormValues | null;
}

export const Pricing = ({ data }: PricingProps) => {
  const [error, setError] = useState<string | null>(null);

  const { isPending, mutateAsync } = useMutation<
    PostSignUpResponse,
    AxiosError,
    SignUpFormValues
  >({
    mutationFn: postSignUp,
    retry: 0,
  });

  const submitData = async () => {
    setError(null);

    if (!data) {
      setError("Form data not found.");
      return;
    }

    try {
      const result = await mutateAsync(data);
      console.debug("postSignUp result:", result);

      const { midtrans_payment_url } = result;

      if (!midtrans_payment_url) {
        throw new Error("Payment URL missing in API response.");
      }
      window.location.replace(midtrans_payment_url);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          setError(
            "Email yang Anda masukkan sudah terdaftar. Silakan gunakan email lain."
          );
        } else {
          setError("Terjadi kesalahan. Silakan coba lagi.");
        }
      }
      console.error(err);
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
      <header className="flex flex-col items-center gap-5 text-center mt-[50px]">
        <h1 className="font-extrabold text-[46px] leading-[69px] text-white">
          Best Pricing For Everyone
          <br />
          Who Wants to Grow Business
        </h1>
        <p className="text-lg leading-[27px] text-white">
          We delivery robust features to anyone unconditionally.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-[30px] max-w-[840px] mx-auto mt-[60px]">
        {/* Card 1 */}
        <div className="card flex flex-col h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A]">
          <img
            src="/assets/images/icons/note-favorite-white.svg"
            className="w-[60px] h-[60px]"
            alt="icon"
          />
          <div>
            <p className="font-extrabold text-[46px] leading-[69px] text-white">
              Rp 80.000
            </p>
            <p className="text-[#6B6C7F] mt-[6px]">Billed every single month</p>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Access gigantic features company
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Students analytics and export
              </p>
            </div>
          </div>
          <hr className="border-[#262A56]" />
          <p className="text-[#FF435A]">
            This plan is not available at this moment in your country, try again
            later.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="#">
              <div className="flex items-center justify-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
                <span className="font-semibold text-white">
                  Contact Our Sales
                </span>
              </div>
            </Link>
          </div>
        </div>
        {/* Card 2 */}
        <div className="card flex flex-col h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A]">
          <img
            src="/assets/images/icons/note-favorite-white.svg"
            className="w-[60px] h-[60px]"
            alt="icon"
          />
          <div>
            <p className="font-extrabold text-[46px] leading-[69px] text-white">
              Rp 280.000
            </p>
            <p className="text-[#6B6C7F] mt-[6px]">Billed every single month</p>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Access gigantic features company
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Students analytics and export
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Life support 24/7 maintenances
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                Export and analyze data real time
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img
                src="/assets/images/icons/tick-circle-white.svg"
                className="flex shrink-0 w-6 h-6"
                alt="icon"
              />
              <p className="font-semibold text-white">
                More big features coming soon
              </p>
            </div>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-3">
            {error && (
              <p role="alert" className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <button type="button" onClick={submitData} disabled={isPending}>
              <div className="flex items-center justify-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#662FFF] border-[#8661EE] shadow-[-10px_-6px_10px_0_#7F33FF_inset]">
                <span className="font-semibold text-white">
                  {isPending ? "Loading..." : "Choose This Plan"}
                </span>
              </div>
            </button>
            <Link to="#">
              <div className="flex items-center justify-center gap-3 w-full rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] hover:shadow-[-10px_-6px_10px_0_#7F33FF_inset] bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset]">
                <span className="font-semibold text-white">
                  Contact Our Sales
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
