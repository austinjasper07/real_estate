import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Loader } from 'lucide-react'

import { forgotPassword } from "../../features/authSlice";
import Input from "../../components/input";


export default function ForgotPassword() {
  const dispatch = useDispatch();
  const forgotPasswordState = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (forgotPasswordState.status === "succeeded") {
      toast.success("Email sent successfully");
    }else if (forgotPasswordState.status === "failed") {
      console.log(forgotPasswordState.error);
      setErrorMessage(forgotPasswordState.error);
      setEmail("");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }, [
    forgotPasswordState.status,
    forgotPasswordState.error,
    forgotPasswordState.message,
    navigate,
  ]);

  function onSubmitHandler(e) {
    e.preventDefault();
    try {
      if (!email) throw new Error("Field required!");

      dispatch(forgotPassword({ email }));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-16 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg w-[70%] sm:w-[65%] md:w-[45%] lg:w-[35%]">
        <h1 className="text-2xl font-bold text-[#228B22] mb-6">
          Forgot Password
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
            disabled={forgotPasswordState.status === "loading"}
            className={`w-full p-3 ${
              forgotPasswordState.status === "loading"
                ? " bg-[#639463] text-white rounded-md cursor-not-allowed"
                : "w-full p-3 bg-[#228B22] text-white rounded-md hover:bg-[#1E7A1E] transition"
            }`}
          >
            {forgotPasswordState.status === "loading" ? (
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
