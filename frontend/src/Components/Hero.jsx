import { useNavigate } from "react-router-dom";


const Hero = () => {

  const navigate = useNavigate();

  return (
    <section id="home" className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-pink-50 via-white to-purple-50">

      {/* Title */}
      <h1 className="font-display text-7xl md:text-8xl tracking-widest">TASK
        <span className="text-pink-600">BRAIN</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-2xl text-gray-600 text-lg">
        <span className="text-sm font-semibold text-pink-600 uppercase tracking-widest">AI-powered project management</span> built for students and teams to
        plan smarter, execute faster, and never miss deadlines.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button onClick={() => navigate("/auth")} 
        className="px-8 py-4 rounded-full text-white font-medium bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
          Get Started Free
        </button>

        <button className="px-8 py-4 rounded-full border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300">
          Learn More
        </button>
      </div>

    </section>
  );
};

export default Hero;
