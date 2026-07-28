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

export function isDemoToken(): boolean {
  const token = localStorage.getItem("campus_access_token");
  return !token || token.startsWith("demo_token");
}

export function getSharedEvents(): ApiEvent[] {
  try {
    const data = localStorage.getItem("campus_shared_events");
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const defaultEvents: ApiEvent[] = [
    {
      id: "demo-1",
      title: "Tech Talk 2026",
      description: "Annual university tech conference featuring AI and web development.",
      category: "Workshop",
      location: "Auditorium A",
      start_time: new Date(Date.now() + 86400000 * 3).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
      registration_deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      capacity: 100,
      status: "PUBLISHED",
      organizer_id: "admin-1",
      registered_count: 1,
      available_seats: 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-2",
      title: "Campus Cultural Music Fest",
      description: "Live student band performances, DJ night, food stalls, and music competitions.",
      category: "Cultural",
      location: "Open Air Theatre",
      start_time: new Date(Date.now() + 86400000 * 7).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 7 + 14400000).toISOString(),
      registration_deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      capacity: 200,
      status: "PUBLISHED",
      organizer_id: "admin-1",
      registered_count: 182,
      available_seats: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
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
    const err = await response.json().catch(() => ({ detail: "Failed to create admin account." }));
    throw new Error(err.detail || "Failed to create admin.");
  }

  return await response.json();
}

export async function getDashboardKPIsApi(): Promise<ApiDashboardKPIs> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local KPI state.");
  }

  const response = await fetch(`${API_BASE}/dashboard/kpis`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard KPIs.");
  }

  return await response.json();
}

export async function getEventsApi(params?: {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<ApiEventList> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.category) query.append("category", params.category);
  if (params?.page) query.append("page", String(params.page));
  if (params?.size) query.append("size", String(params.size));

  const url = `${API_BASE}/events${query.toString() ? `?${query.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch events list.");
  }

  return await response.json();
}

export async function createEventApi(eventData: {
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  capacity: number;
  status?: string;
}): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: event saved locally.");
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
    const err = await response.json().catch(() => ({ detail: "Failed to create event." }));
    throw new Error(err.detail || "Error creating event.");
  }

  return await response.json();
}

export async function updateEventApi(eventId: string, eventData: Partial<ApiEvent>): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: event updated locally.");
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
    const err = await response.json().catch(() => ({ detail: "Failed to update event." }));
    throw new Error(err.detail || "Error updating event.");
  }

  return await response.json();
}

export async function deleteEventApi(eventId: string): Promise<void> {
  if (isDemoToken()) return;

  const response = await fetch(`${API_BASE}/events/${eventId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to delete event.");
  }
}

export async function uploadEventBannerApi(eventId: string, file: File): Promise<ApiEvent> {
  if (isDemoToken()) {
    throw new Error("Demo mode: banner uploaded locally.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/events/${eventId}/banner`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload event banner.");
  }

  return await response.json();
}

export async function getEventParticipantsApi(eventId: string): Promise<ApiParticipant[]> {
  if (isDemoToken()) {
    throw new Error("Demo mode: using local participants.");
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}/participants`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event participants.");
  }

  return await response.json();
}

export async function registerForEventApi(eventId: string): Promise<ApiRegistration> {
  if (isDemoToken()) {
    throw new Error("Demo mode: registered locally.");
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}`, {
    method: "POST",
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Failed to register for event." }));
    throw new Error(err.detail || "Error registering for event.");
  }

  return await response.json();
}

export async function cancelRegistrationApi(eventId: string): Promise<ApiRegistration> {
  if (isDemoToken()) {
    throw new Error("Demo mode: registration cancelled locally.");
  }

  const response = await fetch(`${API_BASE}/registrations/events/${eventId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Failed to cancel registration." }));
    throw new Error(err.detail || "Error cancelling registration.");
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
