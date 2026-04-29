import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignUpForm.jsx";
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";



const Auth = () => {
  const [mode, setMode] = useState("login ");

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

