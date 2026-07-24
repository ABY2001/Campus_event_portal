import { useState } from "react";

import { adminUser, currentUser } from "@/data/auth";
import { LoginPage } from "@/pages/auth";
import { AdminDashboardPage } from "@/pages/admin-dashboard";
import { StudentDashboardPage } from "@/pages/student-dashboard";

type AppRoute = "login" | "student-dashboard" | "admin-dashboard";

export function App() {
  const [route, setRoute] = useState<AppRoute>("login");

  if (route === "login") {
    return (
      <LoginPage
        onSelectAdmin={() => setRoute("admin-dashboard")}
        onSelectStudent={() => setRoute("student-dashboard")}
      />
    );
  }

  if (route === "student-dashboard") {
    return (
      <StudentDashboardPage
        userName={currentUser.name}
        onLogout={() => setRoute("login")}
      />
    );
  }

  return (
    <AdminDashboardPage
      userName={adminUser.name}
      onLogout={() => setRoute("login")}
    />
  );
}
