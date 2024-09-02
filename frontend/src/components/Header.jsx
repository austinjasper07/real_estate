import React, { useState } from "react";
// import { logout } from "../features/userSlice";
import { showModal } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import Modal from "./Modal";


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {modal} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const {user, isAuthenticated} = useSelector((state) => state.user)

  // const logoutFunction = () => {
  //   if (user && isAuthenticated) {
  //     dispatch(logout()).then(() => {
  //       navigate("/login", { replace: true });
  //     });
  //   }
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="max-h-[9%] bg-gradient-to-b from-[#f1f1c9] to-[#b9c8d1] relative mb-6">
      {/* Navbar */}
      <div>
        <nav className="flex justify-between items-center max-w-6xl mx-auto py-3 px-6 sm:px-8 ">
          <Link to={"/"}> {/* Brand */}
            <h1 className="font-bold text-lg sm:text-xl">
              <span>Crystal</span>
              <span>Estate</span>
            </h1>
          </Link>

          <div className="hidden md:flex space-x-6"> {/* Desktop Nav Links */}
            <Link to="/" className="hover:text-[#D4AF37]">Home</Link>
            <Link href="#" className="hover:text-[#D4AF37]">About</Link>
            <Link href="#" className="hover:text-[#D4AF37]">Services</Link>
            <Link href="#" className="hover:text-[#D4AF37]">Contact</Link>
            <button onClick={()=>dispatch(showModal())}>Sign In</button>
          </div>

          <div className="md:hidden"> {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-[#f1f1c9] to-[#b9c8d1] text-slate-900 p-4 space-y-4">
            <Link to={""} className="block hover:text-[#D4AF37]">
              Home
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37]">
              About
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37]">
              Services
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37]">
              Contact
            </Link>
          </div>
        )}
      </div>
      {modal && <Modal />}
    </header>
  );
}
