const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold">
          How TaskBrain <span className="text-pink-600">Works</span>
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Start managing projects smarter in just three simple steps.
        </p>

        {/* Steps */}
        <div className="mt-20 grid gap-12 md:grid-cols-3">

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center
              bg-gradient-to-r from-pink-500 to-purple-500
              text-white text-xl font-bold shadow-lg">
              1
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Sign Up & Choose Role
            </h3>

            <p className="mt-3 text-gray-600 max-w-sm">
              Create your account and choose your role as a student,
              team member, or project manager.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center
              bg-gradient-to-r from-pink-500 to-purple-500
              text-white text-xl font-bold shadow-lg">
              2
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Create or Join Projects
            </h3>

            <p className="mt-3 text-gray-600 max-w-sm">
              Managers create projects and assign tasks,
              while students and employees join teams seamlessly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center
              bg-gradient-to-r from-pink-500 to-purple-500
              text-white text-xl font-bold shadow-lg">
              3
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Track, Meet & Deliver
            </h3>

            <p className="mt-3 text-gray-600 max-w-sm">
              Monitor progress, schedule meetings, collaborate efficiently,
              and deliver projects on time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
