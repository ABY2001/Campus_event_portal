const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("campus_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUserApi(credentials: { email: string; password: string}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Login failed." }));
    throw new Error(errorData.detail || "Invalid email or password");
  }

  const data: ApiAuthResponse = await response.json();
  localStorage.setItem("campus_access_token", data.access_token);
  localStorage.setItem("campus_user", JSON.stringify(data));
  return data;
}

export async function registerUserApi(payload: {
  email: string;
  password: string;
  full_name: string;
  role: "STUDENT" | "ADMIN";
  student_id_number?: string;
  department?: string;
  year_of_study?: number;
  phone_number?: string;
}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Registration failed." }));
    throw new Error(errorData.detail || "Registration failed. Please check input values.");
  }

  const data: ApiAuthResponse = await response.json();
  localStorage.setItem("campus_access_token", data.access_token);
  localStorage.setItem("campus_user", JSON.stringify(data));
  return data;
}

export async function createCustomAdminApi(payload: {
  email: string;
  password: string;
  full_name: string;
}) {
  const response = await fetch(`${API_BASE}/auth/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ ...payload, role: "ADMIN" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Admin creation failed." }));
    throw new Error(errorData.detail || "Could not create custom admin account.");
  }

  return await response.json();
}

export async function getDashboardKPIsApi(): Promise<ApiDashboardKPIs> {
  const response = await fetch(`${API_BASE}/dashboard/kpis`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard KPI metrics.");
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
  const response = await fetch(`${API_BASE}/events/${eventId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to delete event.");
  }
}

export async function uploadEventBannerApi(eventId: string, file: File): Promise<ApiEvent> {
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
  const response = await fetch(`${API_BASE}/registrations/events/${eventId}/participants`, {
    headers: { ...getAuthHeader() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event participants.");
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
