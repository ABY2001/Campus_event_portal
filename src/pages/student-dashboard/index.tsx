import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  getEventsApi,
  registerForEventApi,
  cancelRegistrationApi,
  listMyRegistrationsApi,
  getSharedEvents,
  saveSharedEvents,
  type ApiEvent,
  type ApiRegistration,
} from "@/lib/api";
import {
  announcements,
  categoryFilters,
  studentProfile,
} from "@/data/dashboard";

type StudentDashboardPageProps = {
  onLogout?: () => void;
  userName?: string;
};

export function StudentDashboardPage(props: StudentDashboardPageProps) {
  // Live Events & Registrations State
  const [events, setEvents] = useState<ApiEvent[]>(() => getSharedEvents());
  const [registrations, setRegistrations] = useState<ApiRegistration[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Status & Feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [actionLoadingEventId, setActionLoadingEventId] = useState<string | null>(null);

  // Auto-dismiss notification feedback message after 4 seconds
  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => {
        setFeedbackMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  // Load events and user registrations
  const loadEventsAndRegistrations = async () => {
    try {
      const categoryParam = selectedCategory === "All" ? undefined : selectedCategory;
      const res = await getEventsApi({ category: categoryParam });
      if (res.items && res.items.length > 0) {
        setEvents(res.items);
        saveSharedEvents(res.items);
      } else {
        const stored = getSharedEvents();
        const filtered =
          selectedCategory === "All"
            ? stored
            : stored.filter(
                (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
              );
        setEvents(filtered);
      }
    } catch {
      const stored = getSharedEvents();
      const filtered =
        selectedCategory === "All"
          ? stored
          : stored.filter(
              (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
            );
      setEvents(filtered);
    }

    try {
      const myRegs = await listMyRegistrationsApi();
      setRegistrations(myRegs);
    } catch {
      // Local fallback for offline mode
    }
  };

  useEffect(() => {
    loadEventsAndRegistrations();
  }, [selectedCategory]);

  // Handle Event Registration
  const handleRegisterEvent = async (eventId: string) => {
    setActionLoadingEventId(eventId);
    const targetEvent = events.find((e) => e.id === eventId);
    const title = targetEvent?.title || "Event";

    try {
      const newReg = await registerForEventApi(eventId);
      setRegistrations((prev) => [newReg, ...prev.filter((r) => r.event_id !== eventId)]);
      setEvents((prev) => {
        const updated = prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                registered_count: ev.registered_count + 1,
                available_seats: Math.max(0, ev.available_seats - 1),
              }
            : ev
        );
        saveSharedEvents(updated);
        return updated;
      });
      setFeedbackMsg(`Successfully registered for "${title}"!`);
    } catch {
      // Local fallback execution if backend is offline
      const mockReg: ApiRegistration = {
        id: `reg-${Date.now()}`,
        event_id: eventId,
        user_id: "student-1",
        status: "REGISTERED",
        registered_at: new Date().toISOString(),
        event: targetEvent,
      };
      setRegistrations((prev) => [mockReg, ...prev.filter((r) => r.event_id !== eventId)]);
      setEvents((prev) => {
        const updated = prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                registered_count: ev.registered_count + 1,
                available_seats: Math.max(0, ev.available_seats - 1),
              }
            : ev
        );
        saveSharedEvents(updated);
        return updated;
      });
      setFeedbackMsg(`Successfully registered for "${title}"!`);
    } finally {
      setActionLoadingEventId(null);
    }
  };

  // Handle Cancel Registration
  const handleCancelRegistration = async (eventId: string) => {
    setActionLoadingEventId(eventId);
    const targetEvent = events.find((e) => e.id === eventId);
    const title = targetEvent?.title || "Event";

    try {
      await cancelRegistrationApi(eventId);
    } catch {
      // Local fallback execution
    }

    setRegistrations((prev) => prev.filter((r) => r.event_id !== eventId));
    setEvents((prev) => {
      const updated = prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              registered_count: Math.max(0, ev.registered_count - 1),
              available_seats: ev.available_seats + 1,
            }
          : ev
      );
      saveSharedEvents(updated);
      return updated;
    });
    setFeedbackMsg(`Registration for "${title}" cancelled.`);
    setActionLoadingEventId(null);
  };

  // Compute live stats for welcome hero
  const activeRegistrationsCount = registrations.filter((r) => r.status === "REGISTERED").length;
  const liveStats = [
    { id: "stat-1", label: "My Registrations", value: activeRegistrationsCount },
    { id: "stat-2", label: "Available Events", value: events.length },
    { id: "stat-3", label: "Campus Department", value: "Computer Science" },
  ];

  return (
    <DashboardLayout
      announcements={announcements}
      categories={categoryFilters}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      events={events}
      onLogout={props.onLogout}
      profile={{
        ...studentProfile,
        name: props.userName ?? studentProfile.name,
      }}
      registrations={registrations}
      stats={liveStats}
      onRegisterEvent={handleRegisterEvent}
      onCancelRegistration={handleCancelRegistration}
      actionLoadingEventId={actionLoadingEventId}
      feedbackMsg={feedbackMsg}
      onDismissFeedback={() => setFeedbackMsg(null)}
    />
  );
}
