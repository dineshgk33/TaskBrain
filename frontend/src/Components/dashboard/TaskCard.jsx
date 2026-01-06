import { FaTasks, FaProjectDiagram, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

const iconMap = {
  Projects: <FaProjectDiagram />,
  "Total Tasks": <FaTasks />,
  Completed: <FaCheckCircle />,
  Meetings: <FaCalendarAlt />,
};

const TaskCard = ({ title, value }) => {
  return (
    <div className="
      relative overflow-hidden
      bg-white/60 backdrop-blur-xl
      border border-white/40
      rounded-2xl p-6
      shadow-lg hover:shadow-xl
      transition-all duration-300
    ">
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 to-purple-100/40 opacity-60" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>

        <div className="text-pink-500 text-3xl">
          {iconMap[title]}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
