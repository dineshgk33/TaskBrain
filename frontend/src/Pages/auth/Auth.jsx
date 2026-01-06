import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignUpForm.jsx";
import Footer from "../../Components/Footer.jsx";
import Navbar from "../../Components/navbar/Navbar.jsx";



const Auth = () => {
  const [mode, setMode] = useState("signup");

  return (
    <>
    <Navbar/>
    <AuthLayout>
      {mode === "signup" ? (
        <SignupForm onSwitch={() => setMode("login")} />
      ) : (
        <LoginForm onSwitch={() => setMode("signup")} />
      )}
    </AuthLayout>
    <Footer/>
    </>
  );
};

export default Auth;
