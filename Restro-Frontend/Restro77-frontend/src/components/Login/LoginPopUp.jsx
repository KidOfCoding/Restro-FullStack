import React, { useContext, useState } from "react";
import style from "./loginPopUp.module.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/Auth";
import { ToastContainer, toast } from 'react-toastify';
const LoginPopUp = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      return {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error("Google login error", error);
      throw error;
    }
  };
  const { URl, setToken } = useContext(StoreContext)

  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  })
  const [agree, setAgree] = useState(false);
  const handleGoogleLogin = async (event) => {
    event.preventDefault();

    if (currState === "Sign Up") {
      if (!data.name || !data.phone) {
        toast.error("Please enter Name and Phone number");
        return;
      }
      if (!agree) {
        toast.error("Please agree to Terms and Conditions");
        return;
      }
    }

    let newURl = URl;
    try {
      // 1. Authenticate with Google (Popup)
      const user = await googleLogin();

      // 2. OPTIMISTIC CLOSING: Close modal immediately after Google success
      setShowLogin(false);

      // 3. Show "Processing" feedback so user knows it's working
      const pendingToast = toast.loading("Verifying with server...");

      const payload = {
        name: currState === "Sign Up" ? data.name : user.displayName,
        email: user.email,
        phone: currState === "Sign Up" ? data.phone : null
      };

      console.log("Login Payload:", payload);

      newURl += "/api/user/login";

      // 4. Background: Sync with Backend
      const response = await axios.post(newURl, payload);

      if (response.data.success) {
        // Success
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // Update toast to success
        toast.update(pendingToast, { render: "Login Successful!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        // Handle failure (e.g. need signup)
        if (response.data.requireSignup) {
          // If we optimistically closed, we might need to re-open or just show error
          toast.update(pendingToast, { render: "Account not found. Please Sign Up.", type: "info", isLoading: false, autoClose: 3000 });
          setShowLogin(true); // Re-open since action is needed
          setCurrState("Sign Up");
          setData(prev => ({ ...prev, name: user.displayName || "" }));
        } else {
          toast.update(pendingToast, { render: response.data.message || 'Login failed', type: "error", isLoading: false, autoClose: 3000 });
        }
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Google Login Cancelled or Failed.", { theme: "dark" });
    }
  };

  const onChangehandler = (event) => {
    const name = event.target.name
    const value = event.target.value;

    // Validation
    if (name === "phone") {
      // Allow only numbers
      if (!/^\d*$/.test(value)) return;
      // Max 10 digits
      if (value.length > 10) return;
    }

    if (name === "name") {
      // Max 50 chars
      if (value.length > 50) return;
    }

    setData(data => ({ ...data, [name]: value }))
  }

  // const onLogin = async (event) => {
  //   event.preventDefault();

  //   let newURl = URl

  //   if (currState === "Login") {
  //     newURl += "/api/user/login"
  //   } else {
  //     newURl += "/api/user/register"
  //   }

  //   const response = await axios.post(newURl, data)

  //   if (response.data.success) {
  //     setToken(response.data.token)
  //     console.log(response.data.token);

  //     localStorage.setItem("token", response.data.token)
  //     setShowLogin(false)
  //   } else {
  //     alert(response.data.message)
  //   }

  // }

  return (
    <div className={style.LoginPopUp}>
      <form className={style.LoginPopUpContainer}>
        <div className={style.LoginPopUpTitle}>
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt=""
            onClick={() => {
              setShowLogin(false);
            }}
          />
        </div>
        <div className={style.LoginPopUpInputs}>
          {currState === "Sign Up" && (
            <>
              <input type="text" name="name" onChange={onChangehandler} value={data.name} placeholder="Your Name" required />
              <input type="tel" name="phone" onChange={onChangehandler} value={data.phone} placeholder="Phone Number" required />
            </>
          )}
        </div>
        <button type="button" className={style.googlebtn} onClick={handleGoogleLogin}>
          <span>{currState === "Sign Up" ? "Sign Up with Google" : "Continue with Google"}</span>
        </button>
        <div className={style.LoginPopUpConditon}>
          <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <p>I agree to the terms and conditions</p>
        </div>
        {currState === "Login" ? (
          <p>
            If you don't have an account, <span onClick={() => setCurrState("Sign Up")}>Click Here To Register</span>
          </p>
        ) : (
          <p>
            Already Have an Account? <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
