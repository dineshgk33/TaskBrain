const LoginForm = ({ onSwitch }) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Welcome back
      </h2>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600  hover:to-purple-600 text-white font-medium">
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
