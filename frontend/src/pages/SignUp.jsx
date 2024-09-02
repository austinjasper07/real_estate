import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input, { PasswordInput } from "../components/Input";
import { Mail, Eye, EyeOffIcon, Lock, Loader, IdCard } from "lucide-react";
import toast from "react-hot-toast";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { signup, resetStatus, resetMessage, hideModal } from "../features/authSlice";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [isProfessional, setIsProfessional] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isProfessional: false,
    profession: "",
    firstname: "",
    lastname: "",
    zipCode: "",
    phone: "",
  });
  const dispatch = useDispatch();
  const { message, status, error } = useSelector((state) => state.auth);

  // Handlers
  function onChangeHandler(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    console.log("Form data: ", formData)
    try {
      if (formData.isProfessional) {
        if (
          !formData.email ||
          !formData.password ||
          !formData.profession ||
          !formData.firstname ||
          !formData.lastname ||
          !formData.zipCode ||
          !formData.phone
        ) throw new Error("All fields are required");
        console.log(`Professional User: ${formData}`);
        dispatch(signup(formData));
        
      } else {
        if (!formData.email || !formData.password) throw new Error("All fields are required");
        console.log(`Regular User: ${formData}`)
        dispatch(signup(formData));
      }
    } catch (error) {
      console.log(`This is my error ${error.message}`);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (status === "succeeded") {
      toast.success(message);
      setTimeout(() => {
        dispatch(resetStatus());
        dispatch(resetMessage());
        dispatch(hideModal);
        navigate("/verify_email");
      }, 1000);
    }

    if (status === "failed") {
      toast.error(error);
      setFormData({
        email: "",
        password: "",
        isProfessional: false,
        profession: "",
        firstname: "",
        lastname: "",
        zipCode: "",
        phone: "",
      });
    }

    return () => {
      setFormData({
        email: "",
        password: "",
        isProfessional: false,
        profession: "",
        firstname: "",
        lastname: "",
        zipCode: "",
        phone: "",
      });
    };
  }, [status, message]);
  

  function onClickHandler(e) {
    const passInput = document.getElementById("password");
    if (e.target === passInput) {
      setInputFocus(true);
    } else {
      setInputFocus(false);
    }
  }

  return (
    <div className="w-[90%] mx-auto">
      <form onClick={onClickHandler} onSubmit={onSubmitHandler}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Enter Email"
            id="email"
            value={formData.email}
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            onChange={(e) => {
              onChangeHandler(e);
              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
              if (regex.test(e.target.value)) {
                console.log("Password is valid!");
              } else {
                console.log("Password does not meet the criteria.");
              }
            }}
          />
          {/* {inputFocus && <PasswordStrengthMeter password={userData.password} />} */}
        </div>
        <div className="flex items-center">
          <input
            id="professional-checkbox"
            type="checkbox"
            name="isProfessional"
            // value={formData.isProfessional}
            checked={isProfessional}
            onChange={(e) => {
              setIsProfessional(e.target.checked);
              setFormData((prevData) => ({
                ...prevData,
                isProfessional: true,
              }));
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label
            htmlFor="professional-checkbox"
            className="ml-2 block text-base font-medium text-gray-600"
          >
            I am a landlord or industry professional
          </label>
        </div>

        {isProfessional && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Professional type
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                name="profession"
                value={formData.profession}
                onChange={onChangeHandler}
              >
                <option>Select your category</option>
                <option>Real Estate Agent</option>
                <option>Property Manager</option>
                <option>Landlord</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Firstname"
                  className="w-full font-medium p-2 mt-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
                  value={formData.firstname}
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  className="w-full font-medium p-2 mt-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
                  value={formData.lastname}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip/Postal
              </label>
              <input
                type="text"
                name="zipCode"
                placeholder="Zip/Postal"
                className="w-full font-medium p-2 mt-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
                value={formData.zipCode}
                onChange={onChangeHandler}
              />
            </div>
            {/* <div className="flex space-x-4"> */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full font-medium p-2 mt-1 border border-[#E0E0E0] rounded-xl text-[#2C3E50] placeholder-[#7F8C8D] bg-gray-100 focus:outline-blue-500 focus:border-[#1F3A93]"
                value={formData.phone}
                onChange={onChangeHandler}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled = {status === 'loading'}
          className="w-full bg-blue-600 text-white font-medium py-2 mt-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {status === "loading" ? <Loader className="animate-spin mx-auto" /> : "Submit"}
        </button>

      </form>
        <hr className="bg-gray-400 h-[2px] my-5 w-full" />
        <div className="mb-3 text-center">
          <span className=" text-gray-500 text-lg font-medium mb-3">
            Or connect with:
          </span>
        </div>

        <button className="w-full py-2 border border-slate-300 rounded-md mb-2 hover:bg-zinc-100 transition-colors relative">
          <FcGoogle className="size-6 absolute ml-4" />
          <div className="text-center">Continue with Google</div>
        </button>
        <button className="w-full py-2 border border-slate-300 rounded-md hover:bg-zinc-100 transition-colors relative">
          <FaFacebook className="text-blue-700 size-6 absolute ml-4" />
          <span>Continue with Facebook</span>
        </button>
    </div>
  );
}
