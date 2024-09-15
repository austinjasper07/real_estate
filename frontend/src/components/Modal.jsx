import { useState } from "react";
import Login from "../pages/authPages/Login"
import SignUp from "../pages/authPages/SignUp";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion'
import { hideModal } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Modal() {
  const [activeTab, setActiveTab] = useState("sign-in");
  const dispatch = useDispatch();
  const {modal} = useSelector((state)=> state.auth)

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
            modal ? "block" : "hidden"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { duration: 0.3 } }}
            exit={{ scale: 0 }}
            transition={{duration: 0.3}}
            className="bg-white px-6 pb-8 sm:rounded-3xl shadow-lg w-full h-full sm:w-[29rem] sm:h-[95%] overflow-y-auto"
          >
            <div className="mb-3 sticky top-0 z-50 bg-white px-4 pt-10 pb-6">
              <button
                className="absolute -right-1 top-5 border rounded-full hover:bg-gray-200 hover:scale-75 transition-transform"
                onClick={()=>dispatch(hideModal())}
              >
                <IoIosClose className="size-7 text-slate-400" />
              </button>
              <h2 className="text-2xl font-bold text-center">
                Welcome to CrystalEstate
              </h2>
            </div>
            <div className="flex justify-start mb-4 border-b-2 border-b-gray-300">
              <button
                onClick={() => setActiveTab("sign-in")}
                className={`px-4 py-2 font-semibold hover:text-blue-600 ${
                  activeTab === "sign-in"
                    ? "border-b-4 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("new-account")}
                className={`px-4 py-2 font-semibold hover:text-blue-600 ${
                  activeTab === "new-account"
                    ? "border-b-4 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                New account
              </button>
            </div>
            {activeTab === "sign-in" && <Login />}
            {activeTab === "new-account" && <SignUp />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

