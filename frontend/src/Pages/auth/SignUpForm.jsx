import { useState } from "react";
import RoleSelector from "./RoleSelector.jsx";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";


const SignupForm = ({ onSwitch }) => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // STEP 1: BASIC VALIDATION
    if (!fullName || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    try {
      // Map frontend role to backend role
      let backendRole = role;
      let workRole = ""; // Default empty

      if (role === "manager") {
        backendRole = "PROJECT_MANAGER";
      } else if (role === "student") {
        backendRole = "STUDENT";
        workRole = "Student";
      }

      const userData = {
        fullName,
        email,
        password,
        role: backendRole,
        workRole: workRole // Send workRole to backend
      };

      const response = await signup(userData);

      console.log("Signup Successful:", response);

      // Store minimal auth data or just redirect to login? 
      // Usually after signup we might want them to login or auto-login.
      // keeping existing logic of redirecting but assuming they are authenticated might be wrong if we don't get a token.
      // The backend signup returns the User object, not a token (based on AuthController).
      // So we should probably redirect to login or auto-login. 
      // BUT, the existing code was:
      // localStorage.setItem("role", role.toLowerCase());
      // localStorage.setItem("isAuthenticated", "true");
      // navigate...

      // IF the user wants "connect api", I should probably functionality correct.
      // If backend returns User but not token, I can't really set "isAuthenticated" effectively for future API calls.
      // However, for now request says "connect signup and login page". 
      // Let's redirect to Login page after signup to be safe, or Login automatically.
      // Since `login` API gives the token.

      // Let's try to login automatically or just tell user to login.
      // For a smooth experience, I'll redirect to Login (which is `onSwitch` here? No `onSwitch` switches the view component).

      // let's just alert success and switch to login.
      alert("Signup successful! Please login.");
      onSwitch();

    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed: " + (error.message || JSON.stringify(error)));
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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

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

