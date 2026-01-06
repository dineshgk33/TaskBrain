import { ClipboardList, BarChart3, Clock, Video, LayoutDashboard, GraduationCap } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold">
          Why Choose <span className="text-pink-600">TaskBrain</span>?
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Everything you need to manage tasks, track progress, and
          communicate efficiently — all in one platform.
        </p>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {/* Feature Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-6">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Smart Task Allocation
            </h3>
            <p className="text-gray-600">
              Automatically assign tasks based on skills, workload,
              and deadlines to ensure balanced teams.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-600">
              Monitor real-time progress of students and employees
              across all tasks and projects.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-6">
              ⏱<Clock size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Time Efficiency Insights
            </h3>
            <p className="text-gray-600">
              Identify delays, optimize timelines, and improve
              productivity with actionable insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-6">
              <Video size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Built-in Team Meetings
            </h3>
            <p className="text-gray-600">
              Create and join meetings directly from tasks for fast
              and seamless team communication.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-6">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Unified Dashboard
            </h3>
            <p className="text-gray-600">
              Get a single, clear view of tasks, progress, deadlines,
              and meetings in one place.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-left">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-6">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Student & Team Friendly
            </h3>
            <p className="text-gray-600">
              Designed for academic projects and professional teams,
              making collaboration simple and effective.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
