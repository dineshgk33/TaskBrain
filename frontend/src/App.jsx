import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/auth/Auth";
import LoginForm from "./pages/auth/LoginForm";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import UserManagement from "./pages/dashboard/manager/UserManagement.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Projects from "./pages/dashboard/manager/Projects.jsx";
import Tasks from "./pages/dashboard/manager/Tasks.jsx"
import EmployeeProjects from "./pages/dashboard/EmployeeProjects.jsx";
import EmployeeAI from "./pages/dashboard/EmployeeAI.jsx";
import EmployeeProgress from "./pages/dashboard/EmployeeProgress.jsx";
import EmployeeProfile from "./pages/dashboard/EmployeeProfile.jsx";
import Analytics from "./pages/dashboard/manager/Analytics.jsx";
import AIInsights from "./pages/dashboard/manager/AIInsights.jsx";
import Settings from "./pages/dashboard/manager/Settings.jsx";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<LoginForm />} />

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard/manager"
                    element={
                        <ProtectedRoute allowedRole="manager">
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/employee"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/employee/projects"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeProjects />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/employee/ai"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeAI />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/employee/progress"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeProgress />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/employee/profile"
                    element={
                        <ProtectedRoute allowedRole="employee">
                            <EmployeeProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/student"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/manager/users"
                    element={
                        <ProtectedRoute allowedRole="manager">
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/manager/analytics"
                    element={
                        <ProtectedRoute allowedRole="manager">
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/manager/projects" element={<Projects />} />
                <Route path="/dashboard/manager/tasks" element={<Tasks />} />


                <Route
                    path="/dashboard/manager/ai-insights"
                    element={
                        <ProtectedRoute allowedRole="manager">
                            <AIInsights />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/manager/settings"
                    element={
                        <ProtectedRoute allowedRole="manager">
                            <Settings />
                        </ProtectedRoute>
                    }
                />

            </Route>
        </Routes>
    );
}

export default App;

