import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../assests/firebase.js";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OAuth, reset} from "../features/authSlice.js";

export function GoogleAuth() {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const { status, error, message, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch()

    useEffect(() => {
        if (status === "succeeded") {
            toast.success(message);
            if (user.isProfessional) {
                navigate("/dashboard", { replace: true })
                
            } else {
                navigate("/", { replace: true })
            }
            dispatch(reset());
        }
        if (status === 'failed') {
            console.log(error)
            toast.error(error);
            dispatch(reset());
        }
    
      return () => {
          dispatch(reset());
      }
    }, [status, error, message, user])
    
    async function onClickHandler() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        
        try {
            const response = await signInWithPopup(auth, provider);
            const username = response.user.displayName.split(" ")
            console.log(username[0])
            setUserData(prevData => ({
                ...prevData,
                firstname: response.user.displayName.split(" ")[0],
                lastname: response.user.displayName.split(" ")[1],
                email: response.user.email,
                phone: response.user.phoneNumber,
                isVerified: response.user.emailVerified,
            }));

            dispatch(OAuth(userData));

        } catch (error) {
        
        }
    }

  return (
    <button 
        className="w-full py-2 border border-slate-300 rounded-md mb-2 hover:bg-zinc-100 transition-colors relative"
        onClick={onClickHandler}
    >
      <FcGoogle className="size-6 absolute ml-4" />
      <div className="text-center">Continue with Google</div>
    </button>
  );
}

export function FacebookAuth() {
  return (
    <button className="w-full py-2 border border-slate-300 rounded-md hover:bg-zinc-100 transition-colors relative">
      <FaFacebook className="text-blue-700 size-6 absolute ml-4" />
      <span>Continue with Facebook</span>
    </button>
  );
}
