const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SECTION – FULL BACKGROUND */}
      <div
        className="
          hidden md:flex
          relative
          items-center justify-center
          bg-gradient-to-br from-pink-100 to-purple-100
        "
      >
        {/* Background image */}
        <div
          className="m-10 p-10
            absolute inset-0
            bg-[url('../public/login.svg')]
            bg-no-repeat
            bg-center
            bg-contain
          "
        />

        {/* Overlay content */}
        
      </div>

      {/* RIGHT SECTION – FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
