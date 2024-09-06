import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import Modal from "./components/Modal";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import { check_auth } from "./features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LucideLoader } from "lucide-react";
import Dropdown from "./components/test";
import ProfileMenu from "./components/ProfileMenu";
import { PrivateRoute, Redirect } from "./components/RoutingUsers";

export default function App() {
  const dispatch = useDispatch();
  const { isCheckingAuth, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );
  console.log("User before Check-auth: ", user);

  // Checking for authentication when the app loads, persists the authenticated user's data on Redux
  useEffect(() => {
    dispatch(check_auth());
    console.log("User in check_auth", user);
  }, [dispatch]);

  // If authentication is still being checked, show a loading indicator
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LucideLoader className="animate-spin size-12" />
      </div>
    );
  }

  return (
    <main className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfileMenu />} />
        </Route>

        {/* Redirecting Authenticated users */}
        <Route element={<Redirect />}>
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/verify_email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      <Toaster />
      <Footer />
    </main>
  );
}