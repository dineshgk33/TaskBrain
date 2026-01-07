import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

const LoginForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", frontendRole);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("isAuthenticated", "true");

      // Redirect based on role
      if (frontendRole === "manager") {
        navigate("/dashboard/manager");
      } else if (frontendRole === "student") {
        navigate("/dashboard/student");
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

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

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

