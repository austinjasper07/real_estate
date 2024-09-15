import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset, hideModal } from "../features/authSlice";
import Input, { PasswordInput } from "../components/Input";
import { Mail, Eye, EyeOffIcon, Lock, Loader2 } from "lucide-react";
import { GoogleAuth, FacebookAuth } from "./Oauth";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { message, status, error, modal } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handlers
  function onChangeHandler(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function onSubmitHandler(e) {
    dispatch(reset());
    e.preventDefault();
    try {
      if (!formData.email || !formData.password)
        throw new Error("All fields are required");
      dispatch(login(formData));
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (status === "succeeded") {
      toast.success(message);
      setTimeout(() => {
        navigate("/", { replace: true });
        dispatch(hideModal());
        dispatch(reset());
      }, 1000);
    }

    if (status === "failed") {
      toast.error(error);
      console.log(error);
      setFormData({ email: "", password: "" });
      dispatch(reset());
    }

    return () => {
      setFormData({ email: "", password: "" });
      dispatch(reset());
    };
  }, [status, message, error]);

  return (
    <div>
      <div className={modal ? "w-[90%] mx-auto" : "w-[70%] mx-auto"}>
        <form onSubmit={onSubmitHandler} className="">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              icon={Mail}
              type="text"
              name="email"
              placeholder="Enter Email"
              id="email"
              value={formData.email}
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              icon={Lock}
              eye={Eye}
              eyeOff={EyeOffIcon}
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={onChangeHandler}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Sign in"
            )}
          </button>
          <div className="text-center mt-2">
            <Link
              href="#"
              className="text-blue-600 hover:underline text-lg font-bold"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
        <hr className="bg-gray-400 h-[2px] my-5 w-full" />
        <div className="mb-3 text-center">
          <span className=" text-gray-500 text-lg font-medium mb-3">
            Or connect with:
          </span>
        </div>
        <GoogleAuth />
        <FacebookAuth />
      </div>
    </div>
  );
};

export default Login;
