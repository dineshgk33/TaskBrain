import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isLanding = location.pathname === "/";
    const isAuth = location.pathname === "/auth";

    const navLinks = [
        { label: "Home", href: "home" },
        { label: "Features", href: "features" },
        { label: "How it works", href: "how-it-works" },
        { label: "FAQ", href: "faq" },
    ];

    const handleNavClick = (sectionId) => {
        if (location.pathname === "/") {
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            navigate(`/#${sectionId}`);
        }
        setMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-stone-100 backdrop-blur border-b border-stone-200">

            {/* LOGO */}
            <span
                onClick={() => navigate("/")}
                className="
          text-xl font-semibold cursor-pointer
          bg-gradient-to-r from-pink-500 to-violet-500
          bg-clip-text text-transparent
          transition-all
          hover:from-pink-600 hover:to-violet-600
        "
            >
        TaskBrain AI
      </span>

            {/* LANDING LINKS */}
            {isLanding && (
                <>
                    <div className="hidden md:flex gap-6 text-md">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => handleNavClick(link.href)}
                                className="px-3 py-1 rounded-lg hover:bg-pink-100 hover:text-pink-600 transition-all"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* AUTH BUTTONS */}
                    <div className="hidden md:flex gap-4 ml-6">
                        {["Login", "SignUp"].map((label) => (
                            <button
                                key={label}
                                onClick={() => navigate("/auth")}
                                className="
                  px-4 py-1.5 rounded-2xl font-medium
                  bg-gradient-to-r from-pink-500 to-violet-500
                  text-white
                  transition-all duration-300
                  hover:from-pink-600 hover:to-violet-600
                  hover:shadow-lg hover:scale-105
                  active:scale-95
                "
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* AUTH PAGE ONLY */}
            {isAuth && (
                <span className="text-sm text-gray-500 hidden md:block">
          Secure Authentication
        </span>
            )}

            {/* MOBILE MENU (LANDING ONLY) */}
            {isLanding && (
                <>
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                    {menuOpen && (
                        <div className="absolute top-full right-4 mt-2 w-48 bg-white shadow-lg rounded-xl flex flex-col items-end gap-2 px-4 py-4 text-md z-50">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => handleNavClick(link.href)}
                                    className="w-full text-right px-3 py-2 rounded-lg hover:bg-pink-100 hover:text-pink-600 transition-all"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </nav>
    );
};

export default Navbar;
