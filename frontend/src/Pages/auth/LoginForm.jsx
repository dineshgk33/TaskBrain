import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await login({ email, password });
      console.log("Login Successful:", response);

      // Map backend role to frontend role
      let frontendRole = response.role;
      if (response.role === "PROJECT_MANAGER" || response.role === "MANAGER") {
        frontendRole = "manager";
      } else if (response.role === "STUDENT") {
        frontendRole = "student";
      } else if (response.role === "EMPLOYEE") {
        frontendRole = "employee";
      }

      // Determine precise frontend role
      let finalRole = frontendRole;
      if (frontendRole === "student") {
        const workRole = response.workRole;
        if (workRole && workRole.toLowerCase() !== "student" && workRole !== "N/A") {
          finalRole = "employee";
        } else {
          finalRole = "student";
        }
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", finalRole); // Store 'manager', 'employee', or 'student'
      localStorage.setItem("workRole", response.workRole || ""); // Store specific work role (e.g., DESIGNER)
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("isAuthenticated", "true");

      // Redirect based on finalRole
      if (finalRole === "manager") {
        navigate("/dashboard/manager");
      } else if (finalRole === "employee") {
        navigate("/dashboard/employee");
      } else {
        navigate("/dashboard/student");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed: " + (error.message || JSON.stringify(error)));
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Welcome back
      </h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600  hover:to-purple-600 text-white font-medium">
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-purple-600 font-medium hover:text-pink-600"
        >
          Sign up
        </button>
      </p>
    </>
  );
};

export default LoginForm;

