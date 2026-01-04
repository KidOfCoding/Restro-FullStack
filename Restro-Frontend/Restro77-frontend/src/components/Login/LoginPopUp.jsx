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
  const [googleData, setGoogleData] = useState(null); // Store Google info for step 2

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

    let newURl = URl + "/api/user/login";

    // --- STEP 2: FINALIZE REGISTRATION (User already authenticated with Google) ---
    if (googleData) {
      if (!data.phone) {
        toast.error("Please enter Phone number");
        return;
      }
      if (!agree) {
        toast.error("Please agree to Terms and Conditions");
        return;
      }

      const payload = {
        name: data.name, // Allow user to edit name
        email: googleData.email,
        phone: data.phone // User provided phone
      };

      const pendingToast = toast.loading("Creating Account...");
      try {
        const response = await axios.post(newURl, payload);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.update(pendingToast, { render: "Account Created Successfully!", type: "success", isLoading: false, autoClose: 3000 });
          setShowLogin(false);
          setGoogleData(null);
        } else {
          toast.update(pendingToast, { render: response.data.message || "Registration failed", type: "error", isLoading: false, autoClose: 3000 });
        }
      } catch (err) {
        console.error("Registration Error:", err);
        toast.update(pendingToast, { render: "Error creating account", type: "error", isLoading: false, autoClose: 3000 });
      }
      return;
    }

    // --- STEP 1: INITIAL GOOGLE AUTH ---
    try {
      const user = await googleLogin(); // Trigger Popup

      // Optimistic/Loading Feedback
      const pendingToast = toast.loading("Verifying with server...");

      // Check if user exists
      const payload = { name: user.displayName, email: user.email }; // No phone yet
      const response = await axios.post(newURl, payload);

      if (response.data.success) {
        // User exists -> Login Success
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.update(pendingToast, { render: "Login Successful!", type: "success", isLoading: false, autoClose: 3000 });
        setShowLogin(false);
      }
      else if (response.data.requireSignup) {
        // User new -> Needs to provide phone
        toast.update(pendingToast, { render: "Please complete your profile", type: "info", isLoading: false, autoClose: 2000 });

        setGoogleData(user); // Cache credentials!
        setCurrState("Sign Up");
        setData(prev => ({
          ...prev,
          name: user.displayName || "",
          email: user.email
        }));
        // Logic: Stay open, wait for phone input + button click
      }
      else {
        toast.update(pendingToast, { render: response.data.message || 'Login failed', type: "error", isLoading: false, autoClose: 3000 });
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
          <span>
            {googleData ? "Create Account" : (currState === "Sign Up" ? "Sign Up with Google" : "Continue with Google")}
          </span>
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
