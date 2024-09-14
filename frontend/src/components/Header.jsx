import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion"
import { showModal, logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { IoIosClose } from "react-icons/io";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { modal, user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Drop Down Handlers (Start)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

   const navigate = useNavigate();

   const logoutFunction = () => {
     if (user && isAuthenticated) {
       dispatch(logout()).then(() => {
         dispatch(showModal())
         navigate("/", { replace: true });
       });
     }
   };

  // Function to handle click outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  // Drop Down Handlers (End)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      onClick={handleClickOutside}
      className="bg-white shadow-md font-[sans-serif] tracking-wide relative z-50  text-slate-500"
    >
      <section className="bg-white flex items-center justify-center flex-wrap py-4 px-8 md:px-20 min-h-[60px] fixed w-screen top-0 z-50">
        {/* Search bar for lg scr*/}
        <div className="absolute lg:left-[7%] z-50 bg-gray-100 lg:flex p-2 rounded hidden shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="outline-none bg-transparent w-full text-sm"
          />
          {/* Search Icon (svg) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="20px"
            className="cursor-pointer fill-gray-400 ml-6 rotate-90 inline-block"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </div>

        {/* App Logo */}
        <div className="font-bold text-2xl w-36 lg:ml-0 sm:text-2xl">
          <Link to={"/"}>
            {/* Brand */}
            <h1>
              <span className="text-slate-500">Crystal</span>
              <span className="text-gray-300 text-xl">Estate</span>
            </h1>
          </Link>
        </div>

        {/* The user image or avatar */}
        <div
          className="absolute right-[7%] sm:right-[10%] md:inline-block border-gray-300"
          ref={dropdownRef}
        >
          {/* The user image or avatar svg */}
          <button onClick={toggleDropdown}>
            {isAuthenticated ? (
              <img
                src={user?.imageUrl}
                alt="user-image"
                className="rounded-full h-7 w-7 object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                className="cursor-pointer hover:fill-black"
                viewBox="0 0 512 512"
              >
                <path
                  d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                  data-original="#000000"
                />
              </svg>
            )}
          </button>
          {/* user Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, translateY: -40 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -40 }}
                // style={{ translateX: "-50%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="userMenu absolute z-50 mt-4 w-max rounded-md shadow-lg bg-white ring-2 ring-black ring-opacity-5 hover:block right-0 sm:-right-12 md:-right-16 min-w-40"
              >
                <div className="py-3 px-4">
                  {!isAuthenticated ? (
                    <>
                      <button
                        onClick={() => dispatch(showModal())}
                        type="button"
                        className="w-full hover:text-white font-medium border hover:bg-blue-700 py-2 rounded-lg bg-blue-500 text-white transition-colors"
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      <h6 className="font-semibold">Signed in as:</h6>
                      <p className="text-sm">{user.email}</p>
                    </>
                  )}

                  <hr className="border-b-0 my-1" />
                  <Link
                    to={"/profile"}
                    className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <a
                    href="#"
                    className="block p-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Support
                  </a>
                  <a
                    href="#"
                    className="block p-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    License
                  </a>
                  <hr className="border-b-0 my-2" />

                  <button
                    onClick={logoutFunction}
                    type="button"
                    className={
                      isAuthenticated
                        ? "w-full rounded-lg bg-red-600 py-2 text-sm text-center uppercase text-white hover:bg-red-700 font-bold"
                        : "hidden"
                    }
                  >
                    Log out
                  </button>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown Toggle Icon */}
        <div className="lg:hidden absolute left-[3%] sm:left-[5%]">
          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {isMobileMenuOpen ? (
              <IoIosClose className="size-7 text-slate-400 border rounded-full hover:bg-gray-200 hover:scale-75 transition-transform" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 -1 20 20"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* Div for the navbar menu list */}
      <div className="hidden lg:flex flex-wrap justify-center px-10 py-3 relative group mt-16 mb-8">
        <ul className="md:flex md:gap-x-6 lg:gap-x-10 font-semibold text-[15px]">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Store</a>
          </li>
          <li>
            <a href="#">Feature</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">Source</a>
          </li>
          <li>
            <a href="#">Partner</a>
          </li>
          <li>
            <a href="#">More</a>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="bg-white lg:hidden space-y-4 px-6 sm:rounded-3xl shadow-lg w-full h-screen overflow-y-auto fixed top-0 "
            initial={{ opacity: 0, translateY: -40 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div className="mb-3 sticky top-0 z-50 bg-white px-4 pt-10 pb-6">
              <button
                className="absolute -right-1 top-5 border rounded-full hover:bg-gray-200 hover:scale-75 transition-transform"
                // onClick={() => dispatch(hideModal())}
              ></button>
            </motion.div>

            <Link to={""} className="block hover:text-[#D4AF37]">
              Home
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37] ">
              About
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37]">
              Services
            </Link>
            <Link to={""} className="block hover:text-[#D4AF37]">
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {modal && <Modal />}
    </header>
  );
};

export default Header;
