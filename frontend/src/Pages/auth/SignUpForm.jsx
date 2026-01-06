import { useState } from "react";
import RoleSelector from "./RoleSelector.jsx";
import { useNavigate } from "react-router-dom";


const SignupForm = ({ onSwitch }) => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();

        // STEP 1: BASIC VALIDATION
        if (!fullName || !email || !password || !role) {
            alert("All fields are required");
            return;
        }

        // STEP 1: VERIFICATION LOG
        console.log("STEP 1: Signup Data Captured ✅", {
            fullName,
            email,
            password,
            role,
        });

        // STEP 2: TEMP AUTH STORAGE
        localStorage.setItem("role", role.toLowerCase());
        localStorage.setItem("isAuthenticated", "true");

        console.log("STEP 2: Auth Data Stored ✅", {
            role: localStorage.getItem("role"),
            isAuthenticated: localStorage.getItem("isAuthenticated"),
        });

        // STEP 3: ROLE-BASED REDIRECT
        if (role === "manager") {
            navigate("/dashboard/manager");
        } else if (role === "student") {
            navigate("/dashboard/student");
        }
    };



  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Create your account
      </h2>

      <form className="space-y-4" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />

        {/* ROLE SELECTION */}
        <RoleSelector role={role} setRole={setRole} />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r
            from-pink-500 to-purple-500 text-white
            hover:from-pink-600 hover:to-purple-600 font-medium"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-pink-600 font-medium hover:text-purple-600"
        >
          Log in
        </button>
      </p>
    </>
  );
};

export default SignupForm;
