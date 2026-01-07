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

                <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}

export default App;

