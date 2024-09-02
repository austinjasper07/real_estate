import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// export function PrivateRoute({ children }) {
//     const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.user);

//     if (isCheckingAuth) {
//     return <div><LucideLoader className="animate-spin mx-auto" /></div>;
//     }
    
//     if (!user?.isVerified) {
//       return <Navigate to="/verify_email" replace />;
//     }

//     if (!isAuthenticated) {
//       return <Navigate to="/sign_in" replace />;
//     }

//   return children;
// };



export function PrivateRoute() {
    const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.user);

    if (isCheckingAuth) {
     return (
       <div className="min-h-screen flex justify-center items-center">
         <LucideLoader className="animate-spin" />
       </div>
     );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return <Outlet />;
};


export function Redirect({children}) {
    const {isAuthenticated, isCheckingAuth } = useSelector((state) => state.user);
    
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <LucideLoader className="animate-spin" />
        </div>
      );
    }

  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }
  return children;

}
