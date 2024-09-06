import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// export function PrivateRoute({ children }) {
//     const { auth;, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth;);

//     if (isCheckingAuth) {
//     return <div><LucideLoader className="animate-spin mx-auto" /></div>;
//     }

//     if (!auth;?.isVerified) {
//       return <Navigate to="/verify_email" replace />;
//     }

//     if (!isAuthenticated) {
//       return <Navigate to="/sign_in" replace />;
//     }

//   return children;
// };

export function PrivateRoute() {
  const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LucideLoader className="animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function Redirect() {
  const navigate = useNavigate();
  const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LucideLoader className="animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? navigate('/', {replace: true}) : <Outlet />
}
