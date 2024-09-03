
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Loader } from 'lucide-react'

import { resend_verifyCode } from "../features/userSlice";
import Input from "../components/input";


export default function ResendVerificationCode() {
  const dispatch = useDispatch();
  const resendVerifyCodeState = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (resendVerifyCodeState.status === "succeeded") {
      toast.success("Email sent successfully");
      setEmail('')
    }else if (resendVerifyCodeState.status === "failed") {
      console.log(resendVerifyCodeState.error);
      setErrorMessage(resendVerifyCodeState.error);
      setEmail("");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }, [
    resendVerifyCodeState.status,
    resendVerifyCodeState.error,
    resendVerifyCodeState.message,
    navigate,
  ]);

  function onSubmitHandler(e) {
    e.preventDefault();
    try {
      if (!email) throw new Error("Field required!");

      dispatch(resend_verifyCode({ email }));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-16 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg w-[70%] sm:w-[65%] md:w-[45%] lg:w-[35%]">
        <h1 className="text-2xl font-bold text-[#228B22] mb-6">
          Resend Verification Code
        </h1>

        <form
          onSubmit={onSubmitHandler}
          className=" w-[100%] space-y-5 md:space-y-0"
        >
          <Input
            icon={Mail}
            type="text"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={resendVerifyCodeState.status === "loading"}
            className={`w-full p-3 ${
              resendVerifyCodeState.status === "loading"
                ? " bg-[#639463] text-white rounded-md cursor-not-allowed"
                : "w-full p-3 bg-[#228B22] text-white rounded-md hover:bg-[#1E7A1E] transition"
            }`}
          >
            {resendVerifyCodeState.status === "loading" ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              "Send Reset Email"
            )}
          </button>

          <div>
            <p className="text-red-600 mt-2 italic text-sm">{errorMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
