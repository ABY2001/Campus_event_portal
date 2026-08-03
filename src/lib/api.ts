const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";

export type ApiAuthResponse = {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
  role: "STUDENT" | "ADMIN";
};

export type ApiDashboardKPIs = {
  total_students: number;
  total_admins: number;
  total_events: number;
  upcoming_events: number;
  total_active_registrations: number;
};

export type ApiEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  capacity: number;
  banner_url?: string | null;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  organizer_id: string;
  organizer_name?: string;
  registered_count: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
};

export type ApiEventList = {
  total: number;
  page: number;
  size: number;
  items: ApiEvent[];
};

export type ApiParticipant = {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  registered_at: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
};

export type ApiRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  status: "REGISTERED" | "WAITLISTED" | "CANCELLED";
  registered_at: string;
  event?: ApiEvent;
};

export type DemoUserRecord = {
  email: string;
  password?: string;
  full_name: string;
  role: "STUDENT" | "ADMIN";
};

export function isDemoToken(): boolean {
  const token = localStorage.getItem("campus_access_token");
  return !token || token.startsWith("demo_token");
}

export function getDemoRegisteredUsers(): DemoUserRecord[] {
  try {
    const data = localStorage.getItem("campus_demo_registered_users");
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    { email: "student@campus.edu", full_name: "Campus Student", role: "STUDENT" },
    { email: "admin@campus.edu", full_name: "Campus Admin", role: "ADMIN" },
  ];
}

export function saveDemoRegisteredUser(user: DemoUserRecord) {
  try {
    const list = getDemoRegisteredUsers();
    const existing = list.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    const updated = [user, ...existing];
    localStorage.setItem("campus_demo_registered_users", JSON.stringify(updated));
  } catch {}
}

export function getSharedEvents(): ApiEvent[] {
  try {
    const data = localStorage.getItem("campus_shared_events");
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Filter out Tech Talk and Campus Cultural Music Fest
        const filtered = parsed.filter(
          (e: ApiEvent) =>
            !e.title.toLowerCase().includes("tech talk") &&
            !e.title.toLowerCase().includes("cultural music fest") &&
            !e.title.toLowerCase().includes("cultural fest")
        );
        if (filtered.length > 0) return filtered;
      }
    }
  } catch {}

  // Clean default events array without unwanted demo items
  const defaultEvents: ApiEvent[] = [];
  return defaultEvents;
}

export function saveSharedEvents(events: ApiEvent[]) {
  try {
    localStorage.setItem("campus_shared_events", JSON.stringify(events));
  } catch {}
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("campus_access_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function loginUserApi(credentials: {
  email: string;
  password: string;
}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Login failed." }));
    throw new Error(errorData.detail || "Invalid email or password.");
  }

  const data: ApiAuthResponse = await response.json();
  localStorage.setItem("campus_access_token", data.access_token);
  localStorage.setItem("campus_user", JSON.stringify(data));
  return data;
}

export async function registerUserApi(userData: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  department?: string;
  student_id_number?: string;
}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      role: userData.role || "STUDENT",
      department: userData.department,
      student_id_number: userData.student_id_number,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Registration failed." }));
    throw new Error(errorData.detail || "Failed to create account.");
  }

  const data: ApiAuthResponse = await response.json();
  localStorage.setItem("campus_access_token", data.access_token);
  localStorage.setItem("campus_user", JSON.stringify(data));
  return data;
}

export async function createCustomAdminApi(adminData: {
  email: string;
  password: string;
  full_name: string;
}): Promise<ApiAuthResponse> {
  if (isDemoToken()) {
    saveDemoRegisteredUser({
      email: adminData.email,
      password: adminData.password,
      full_name: adminData.full_name,
      role: "ADMIN",
    });
    throw new Error("Demo mode: admin account created locally.");
  }

  const response = await fetch(`${API_BASE}/auth/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      email: adminData.email,
      password: adminData.password,
      full_name: adminData.full_name,
      role: "ADMIN",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to create custom admin." }));
    throw new Error(errorData.detail || "Could not create custom admin account.");
  }

  return await response.json();
}

export async function getDashboardKPIsApi(): Promise<ApiDashboardKPIs> {
  if (isDemoToken()) {
    const sharedEvents = getSharedEvents();
    const demoUsers = getDemoRegisteredUsers();
    return {
      total_students: demoUsers.filter((u) => u.role === "STUDENT").length,
      total_admins: demoUsers.filter((u) => u.role === "ADMIN").length,
      total_events: sharedEvents.length,
      upcoming_events: sharedEvents.filter((e) => e.status === "PUBLISHED").length,
      total_active_registrations: sharedEvents.reduce((sum, e) => sum + (e.registered_count || 0), 0),
    };
  }

  const response = await fetch(`${API_BASE}/dashboard/kpis`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    const sharedEvents = getSharedEvents();
    const demoUsers = getDemoRegisteredUsers();
    return {
      total_students: demoUsers.filter((u) => u.role === "STUDENT").length,
      total_admins: demoUsers.filter((u) => u.role === "ADMIN").length,
      total_events: sharedEvents.length,
      upcoming_events: sharedEvents.filter((e) => e.status === "PUBLISHED").length,
      total_active_registrations: sharedEvents.reduce((sum, e) => sum + (e.registered_count || 0), 0),
    };
  }

  return await response.json();
}

export async function getEventsApi(params?: {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<ApiEventList> {
  if (isDemoToken()) {
    const sharedEvents = getSharedEvents();
    return {
      total: sharedEvents.length,
      page: params?.page || 1,
      size: params?.size || 10,
      items: sharedEvents,
    };
  }

  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append("search", params.search);
  if (params?.category && params.category !== "All") searchParams.append("category", params.category);
  if (params?.page) searchParams.append("page", String(params.page));
  if (params?.size) searchParams.append("size", String(params.size));

  const response = await fetch(`${API_BASE}/events?${searchParams.toString()}`);
  if (!response.ok) {
    const sharedEvents = getSharedEvents();
    return {
      total: sharedEvents.length,
      page: params?.page || 1,
      size: params?.size || 10,
      items: sharedEvents,
    };
  }

  return await response.json();
}

export async function createEventApi(eventData: Partial<ApiEvent>): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local state.");
  }

  const response = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to create event." }));
    throw new Error(errorData.detail || "Error creating event.");
  }

  return await response.json();
}

export async function updateEventApi(eventId: string, eventData: Partial<ApiEvent>): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local state.");
  }

  const response = await fetch(`${API_BASE}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to update event." }));
    throw new Error(errorData.detail || "Error updating event.");
  }

  return await response.json();
}

export async function deleteEventApi(eventId: string): Promise<void> {
  if (isDemoToken()) {
    return;
  }

  const response = await fetch(`${API_BASE}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to delete event." }));
    throw new Error(errorData.detail || "Error deleting event.");
  }
}

export async function uploadEventBannerApi(eventId: string, file: File): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local banner state.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/events/${eventId}/banner`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to upload banner image." }));
    throw new Error(errorData.detail || "Error uploading banner image.");
  }

  return await response.json();
}

export async function registerForEventApi(eventId: string): Promise<ApiRegistration> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local registrations.");
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to register for event." }));
    throw new Error(errorData.detail || "Error registering for event.");
  }

  return await response.json();
}

export async function cancelRegistrationApi(eventId: string): Promise<void> {
  if (isDemoToken()) {
    return;
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to cancel registration." }));
    throw new Error(errorData.detail || "Error cancelling registration.");
  }
}

export async function getEventParticipantsApi(eventId: string): Promise<ApiParticipant[]> {
  if (isDemoToken()) {
    return [];
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}/participants`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
}

export async function listMyRegistrationsApi(): Promise<ApiRegistration[]> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local registrations.");
  }

  const response = await fetch(`${API_BASE}/registrations/my`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my registrations.");
  }

  return await response.json();
}

export function getStoredUser(): ApiAuthResponse | null {
  try {
    const stored = localStorage.getItem("campus_user");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function logoutUserApi() {
  localStorage.removeItem("campus_access_token");
  localStorage.removeItem("campus_user");
}
