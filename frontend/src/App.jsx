import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Auth from "./Pages/auth/Auth";
import LoginForm from "./Pages/auth/LoginForm";
import ManagerDashboard from "./Pages/dashboard/ManagerDashboard";
import StudentDashboard from "./Pages/dashboard/StudentDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import UserManagement from "./Pages/dashboard/manager/UserManagement.jsx";


function App() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<LoginForm />} />

            {/* DASHBOARD */}
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

            </Route>
        </Routes>
    );
}

export default App;
