import { useState, useEffect } from "react";
import { LoginPage, SignupPage } from "@/pages/auth";
import { AdminDashboardPage } from "@/pages/admin-dashboard";
import { StudentDashboardPage } from "@/pages/student-dashboard";
import { logoutUserApi, type ApiAuthResponse } from "@/lib/api";

type AppRoute = "login" | "signup" | "student-dashboard" | "admin-dashboard";

export function App() {
  const [currentUser, setCurrentUser] = useState<ApiAuthResponse | null>(null);
  const [route, setRoute] = useState<AppRoute>("login");

  // Ensure Login Auth page is ALWAYS the initial page loaded when starting app
  useEffect(() => {
    logoutUserApi();
  }, []);

  const handleAuthSuccess = (user: ApiAuthResponse) => {
    setCurrentUser(user);
    if (user.role === "ADMIN") {
      setRoute("admin-dashboard");
    } else {
      setRoute("student-dashboard");
    }
  };

  const handleLogout = () => {
    logoutUserApi();
    setCurrentUser(null);
    setRoute("login");
  };

  if (route === "signup") {
    return (
      <SignupPage
        onSuccess={handleAuthSuccess}
        onNavigateToLogin={() => setRoute("login")}
      />
    );
  }

  if (route === "login") {
    return (
      <LoginPage
        onSuccess={handleAuthSuccess}
        onNavigateToSignup={() => setRoute("signup")}
      />
    );
  }

  if (route === "student-dashboard") {
    return (
      <StudentDashboardPage
        userName={currentUser?.full_name || "Campus Student"}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AdminDashboardPage
      userName={currentUser?.full_name || "Campus Admin"}
      onLogout={handleLogout}
    />
  );
}
