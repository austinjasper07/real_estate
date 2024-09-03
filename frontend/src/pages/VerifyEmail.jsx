import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail, reset } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
// import { motion } from "framer-motion";



const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, message, error, user } = useSelector((state) => state.auth);

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      toast.success(message);
      setTimeout(() => {
        if (user.isProfessional) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 3000);
      dispatch(reset());
    }
    if (status === "failed") {
      toast.error(error.message);
      dispatch(reset());
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    }
  }, [status, message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(reset());
    const verificationCode = code.join("");
    try {
      dispatch(verifyEmail({ verificationCode }));
    } catch (error) {
      toast.error(error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      setTimeout(() => {
        handleSubmit(new Event("submit"));
      }, 200);
    }
    dispatch(reset());
  }, [code]);

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-16 flex flex-col justify-center items-center">
      <div className="bg-slate-400 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        {status === "succeeded" ? (
          <div className="text-green-600 mb-4">
            Verification successful! Redirecting to Dashboard...
          </div>
        ) : (
          <>
            <p className="text-center text-gray-100 mb-6">
              Enter the 6-digit code sent to your email address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading" || code.some((digit) => !digit)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default VerifyEmail;
