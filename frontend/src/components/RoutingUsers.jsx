import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { showModal } from "../features/authSlice";


export function PrivateRoute() {
  const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LucideLoader className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    dispatch(showModal());
    return <Navigate to="/" replace />
  }

  return <Outlet />
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
  return isAuthenticated ? navigate('/profile', { replace: true }) : <Outlet />;
}
