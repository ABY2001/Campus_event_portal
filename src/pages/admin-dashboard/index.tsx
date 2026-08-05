import { useState, useEffect } from "react";
import {
  getDashboardKPIsApi,
  getEventsApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
  uploadEventBannerApi,
  getEventParticipantsApi,
  createCustomAdminApi,
  getSharedEvents,
  saveSharedEvents,
  getDemoRegisteredUsers,
  type ApiDashboardKPIs,
  type ApiEvent,
  type ApiParticipant,
} from "@/lib/api";
import { PasswordField } from "@/components/auth/PasswordField";
import { FiSearch } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { MdOutlineDashboardCustomize } from "react-icons/md";

type AdminDashboardPageProps = {
  onLogout?: () => void;
  userName?: string;
};

export function AdminDashboardPage({
  onLogout,
  userName = "Campus Admin",
}: AdminDashboardPageProps) {
  // Live KPI Data
  const [kpis, setKpis] = useState<ApiDashboardKPIs | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);

  // Live Users Counters for fallback state
  const [studentUsersCount, setStudentUsersCount] = useState(1);
  const [adminUsersCount, setAdminUsersCount] = useState(1);

  // Shared Events Data
  const [events, setEvents] = useState<ApiEvent[]>(() => getSharedEvents());
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [page] = useState(1);

  // Modal States
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
  const [bannerUploadEvent, setBannerUploadEvent] = useState<ApiEvent | null>(null);
  const [participantsModalEvent, setParticipantsModalEvent] = useState<ApiEvent | null>(null);
  const [participantsList, setParticipantsList] = useState<ApiParticipant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  // Form States - Create/Edit Event
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventCategory, setEventCategory] = useState("Workshop");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventCapacity, setEventCapacity] = useState(50);
  const [eventStatus, setEventStatus] = useState<"DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED">("PUBLISHED");
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Admin Form States
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Status & Feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Auto-dismiss notification feedback message after 4 seconds
  useEffect(() => {
    if (feedbackMsg) {
      const timer = setTimeout(() => {
        setFeedbackMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMsg]);

  // Load live data from FastAPI backend
  const loadKpis = async () => {
    setIsLoadingKpis(true);
    try {
      const data = await getDashboardKPIsApi();
      setKpis(data);
      setStudentUsersCount(data.total_students);
      setAdminUsersCount(data.total_admins);
    } catch {
      // Dynamic fallback metrics calculated from registered users list
      const demoUsers = getDemoRegisteredUsers();
      const studentCount = demoUsers.filter((u) => u.role === "STUDENT").length;
      const adminCount = demoUsers.filter((u) => u.role === "ADMIN").length;
      const currentEvents = getSharedEvents();

      setKpis({
        total_students: studentCount,
        total_admins: adminCount,
        total_events: currentEvents.length,
        upcoming_events: currentEvents.filter((e) => e.status === "PUBLISHED").length,
        total_active_registrations: currentEvents.reduce((sum, e) => sum + (e.registered_count || 0), 0),
      });
      setStudentUsersCount(studentCount);
      setAdminUsersCount(adminCount);
    } finally {
      setIsLoadingKpis(false);
    }
  };

  const loadEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await getEventsApi({ search: searchQuery, page, size: 10 });
      if (res.items && res.items.length > 0) {
        setEvents(res.items);
        saveSharedEvents(res.items);
      } else {
        const stored = getSharedEvents();
        setEvents(stored);
      }
    } catch {
      const stored = getSharedEvents();
      setEvents(stored);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadKpis();
    loadEvents();
  }, [page, searchQuery]);

  // Dynamic search filtering across title, description, category, and location
  const displayedEvents = events.filter((ev) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      ev.title.toLowerCase().includes(query) ||
      ev.description.toLowerCase().includes(query) ||
      ev.category.toLowerCase().includes(query) ||
      ev.location.toLowerCase().includes(query)
    );
  });

  // Dynamic KPI calculation values directly calculated from active state
  const dynamicTotalEvents = events.length;
  const dynamicActiveRegistrations = events.reduce((sum, ev) => sum + (ev.registered_count || 0), 0);

  // Handle Event Creation / Update
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    setFeedbackMsg(null);

    const parseDateSafe = (val: string, fallbackOffsetMs: number = 0) => {
      if (!val) return new Date(Date.now() + fallbackOffsetMs).toISOString();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date(Date.now() + fallbackOffsetMs).toISOString() : d.toISOString();
    };

    const startTimeIso = parseDateSafe(eventStartTime, 86400000);
    const endTimeIso = parseDateSafe(eventEndTime, 86400000 + 7200000);
    const deadlineIso = parseDateSafe(eventDeadline, 43200000);

    const payload = {
      title: eventTitle,
      description: eventDesc,
      category: eventCategory,
      location: eventLocation,
      start_time: startTimeIso,
      end_time: endTimeIso,
      registration_deadline: deadlineIso,
      capacity: Number(eventCapacity),
      status: eventStatus,
    };

    let savedEv: ApiEvent | null = null;

    try {
      if (editingEvent) {
        savedEv = await updateEventApi(editingEvent.id, payload);
      } else {
        savedEv = await createEventApi(payload);
      }

      if (bannerFile && savedEv?.id) {
        const updatedWithBanner = await uploadEventBannerApi(savedEv.id, bannerFile);
        if (updatedWithBanner) savedEv = updatedWithBanner;
      }
    } catch {
      // Offline fallback handling
    }

    const formattedBannerUrl = bannerFile ? URL.createObjectURL(bannerFile) : (savedEv?.banner_url || editingEvent?.banner_url || null);

    const newDisplayEvent: ApiEvent = {
      id: savedEv?.id || editingEvent?.id || `event-${Date.now()}`,
      title: eventTitle,
      description: eventDesc,
      category: eventCategory,
      location: eventLocation,
      start_time: startTimeIso,
      end_time: endTimeIso,
      registration_deadline: deadlineIso,
      capacity: Number(eventCapacity),
      banner_url: formattedBannerUrl,
      status: eventStatus,
      organizer_id: "admin-1",
      organizer_name: userName,
      registered_count: editingEvent?.registered_count || 0,
      available_seats: Math.max(0, Number(eventCapacity) - (editingEvent?.registered_count || 0)),
      created_at: editingEvent?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEvents((prev) => {
      let updated: ApiEvent[];
      if (editingEvent) {
        updated = prev.map((item) => (item.id === editingEvent.id ? newDisplayEvent : item));
      } else {
        updated = [newDisplayEvent, ...prev];
      }
      saveSharedEvents(updated);
      return updated;
    });

    setFeedbackMsg(`Event "${eventTitle}" ${editingEvent ? "updated" : "published"} successfully!`);
    resetEventForm();
    setIsActionLoading(false);
  };

  // Handle Event Deletion
  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await deleteEventApi(eventId);
    } catch {
      // Local fallback
    }
    setEvents((current) => {
      const updated = current.filter((ev) => ev.id !== eventId);
      saveSharedEvents(updated);
      return updated;
    });
    setFeedbackMsg(`Event "${title}" deleted successfully.`);
  };

  // Handle Banner Upload
  const handleUploadBannerFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerUploadEvent || !bannerFile) return;
    setIsActionLoading(true);

    const bannerPreviewUrl = URL.createObjectURL(bannerFile);

    const updateEventWithBanner = (finalBannerUrl: string) => {
      setEvents((prev) => {
        const updatedList = prev.map((ev) =>
          ev.id === bannerUploadEvent.id ? { ...ev, banner_url: finalBannerUrl } : ev
        );
        saveSharedEvents(updatedList);
        return updatedList;
      });
    };

    try {
      const updated = await uploadEventBannerApi(bannerUploadEvent.id, bannerFile);
      if (updated.banner_url) {
        updateEventWithBanner(updated.banner_url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateEventWithBanner((reader.result as string) || bannerPreviewUrl);
        };
        reader.readAsDataURL(bannerFile);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateEventWithBanner((reader.result as string) || bannerPreviewUrl);
      };
      reader.readAsDataURL(bannerFile);
    }

    setFeedbackMsg(`Banner uploaded for event "${bannerUploadEvent.title}"!`);
    setBannerUploadEvent(null);
    setBannerFile(null);
    setIsActionLoading(false);
  };

  // View Participants
  const handleOpenParticipants = async (event: ApiEvent) => {
    setParticipantsModalEvent(event);
    setIsLoadingParticipants(true);
    try {
      const list = await getEventParticipantsApi(event.id);
      setParticipantsList(list);
    } catch {
      setParticipantsList([
        {
          id: "p1",
          event_id: event.id,
          user_id: "u1",
          status: "REGISTERED",
          registered_at: new Date().toISOString(),
          user: { id: "u1", email: "aby@campus.edu", full_name: "Aby Ponnachan", role: "STUDENT" },
        },
      ]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  // Open Edit Form
  const handleOpenEditModal = (event: ApiEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDesc(event.description);
    setEventCategory(event.category);
    setEventLocation(event.location);
    setEventStartTime(event.start_time.slice(0, 16));
    setEventEndTime(event.end_time.slice(0, 16));
    setEventDeadline(event.registration_deadline.slice(0, 16));
    setEventCapacity(event.capacity);
    setEventStatus(event.status);
    setShowCreateEventModal(true);
  };

  const resetEventForm = () => {
    setShowCreateEventModal(false);
    setEditingEvent(null);
    setEventTitle("");
    setEventDesc("");
    setEventCategory("Workshop");
    setEventLocation("");
    setEventStartTime("");
    setEventEndTime("");
    setEventDeadline("");
    setEventCapacity(50);
    setEventStatus("PUBLISHED");
    setBannerFile(null);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    setAdminSuccessMsg(null);
    try {
      await createCustomAdminApi({ full_name: adminName, email: adminEmail, password: adminPassword });
      setAdminSuccessMsg(`Custom Admin account for ${adminName} (${adminEmail}) created successfully!`);
    } catch {
      setAdminSuccessMsg(`Custom Admin account for ${adminName} created! (Demo)`);
    } finally {
      setAdminUsersCount((prev) => prev + 1);
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      setIsActionLoading(false);
      setTimeout(() => setShowAddAdminModal(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950">
      <div className="flex min-h-screen w-full overflow-hidden bg-white shadow-xl">
        {/* Sidebar */}
        <aside className="hidden w-28 flex-col justify-between bg-slate-950 px-4 py-7 text-white lg:flex">
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-xl font-semibold">
                CE
              </div>
            </div>
            <nav className="space-y-4">
              {["Dashboard"].map((item, index) => (
                <button
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl text-sm font-medium transition ${
                    index === 0 ? "bg-white text-slate-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  key={item}
                  title={item}
                  type="button"
                >
                  <MdOutlineDashboardCustomize className="text-2xl" />
                </button>
              ))}
            </nav>
          </div>
          <button
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white transition hover:bg-red-500/20 hover:text-red-400"
            onClick={onLogout}
            title="Sign out & return to Login"
            type="button"
          >
            <CiLogout className="text-2xl" />
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Campus Event Management Portal
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex items-center min-w-[240px] sm:min-w-[340px]">
                  <FiSearch className="absolute left-4 text-base text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search live events by title, location..."
                    className="h-14 w-full rounded-[22px] border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 transition hover:bg-slate-300"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    resetEventForm();
                    setShowCreateEventModal(true);
                  }}
                  className="h-14 rounded-[22px] bg-slate-950 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
                  type="button"
                >
                  + Create Event
                </button>

                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="h-14 rounded-[22px] border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
                  type="button"
                >
                  👤 + Add Admin
                </button>

                <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex h-14 items-center gap-2 rounded-[22px] border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Sign out and return to Login page"
                  >
                    <span>← Back to Login</span>
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7">
            <div className="space-y-6">
              {/* Auto-Dismissing Notification Feedback Alert */}
              {feedbackMsg && (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">✓</span>
                    {feedbackMsg}
                  </span>
                  <button
                    onClick={() => setFeedbackMsg(null)}
                    className="ml-4 rounded-lg p-1 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                    title="Dismiss notification"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* DYNAMIC LIVE KPI CARDS */}
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                    ST
                  </div>
                  <p className="mt-6 text-sm text-slate-500">Total Students</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
                    {isLoadingKpis ? "..." : (kpis?.total_students ?? studentUsersCount)}
                  </p>
                </article>

                <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                    AD
                  </div>
                  <p className="mt-6 text-sm text-slate-500">Total Admins</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
                    {isLoadingKpis ? "..." : (kpis?.total_admins ?? adminUsersCount)}
                  </p>
                </article>

                <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                    EV
                  </div>
                  <p className="mt-6 text-sm text-slate-500">Total Events</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
                    {isLoadingKpis && events.length === 0 ? "..." : dynamicTotalEvents}
                  </p>
                </article>

                <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                    RG
                  </div>
                  <p className="mt-6 text-sm text-slate-500">Active Registrations</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
                    {isLoadingKpis && events.length === 0 ? "..." : dynamicActiveRegistrations}
                  </p>
                </article>
              </section>

              {/* DYNAMIC EVENTS LIST SECTION */}
              <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">
                      Live Campus Events Management ({displayedEvents.length})
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {searchQuery
                        ? `Showing results for "${searchQuery}"`
                        : "Manage events, edit details, upload banner images, and track registered participants."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetEventForm();
                      setShowCreateEventModal(true);
                    }}
                    className="rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    + Create New Event
                  </button>
                </div>

                {isLoadingEvents ? (
                  <div className="py-12 text-center text-sm text-slate-400">Loading live events database...</div>
                ) : displayedEvents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    {searchQuery
                      ? `No events found matching "${searchQuery}".`
                      : 'No events found. Click "+ Create New Event" to publish your first campus event!'}
                  </div>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {displayedEvents.map((ev) => (
                      <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5" key={ev.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                              {ev.category}
                            </span>
                            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{ev.title}</h3>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{ev.description}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              ev.available_seats > 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {ev.available_seats > 0 ? `${ev.available_seats} seats left` : "Full"}
                          </span>
                        </div>

                        {ev.banner_url && (
                          <div className="mt-4 h-36 w-full overflow-hidden rounded-2xl bg-slate-200">
                            <img
                              src={
                                ev.banner_url.startsWith("http") || ev.banner_url.startsWith("blob") || ev.banner_url.startsWith("data:")
                                  ? ev.banner_url
                                  : `http://localhost:8000${ev.banner_url}`
                              }
                              alt={ev.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                          <div className="rounded-xl bg-white px-3 py-2 border border-slate-200">
                            {ev.location}
                          </div>
                          <div className="rounded-xl bg-white px-3 py-2 border border-slate-200">
                            {new Date(ev.start_time).toLocaleDateString()} at {new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="rounded-xl bg-white px-3 py-2 border border-slate-200">
                            {ev.registered_count} / {ev.capacity} Registered
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4">
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            className="h-10 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setBannerUploadEvent(ev)}
                            className="h-10 rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Upload Banner
                          </button>
                          <button
                            onClick={() => handleOpenParticipants(ev)}
                            className="h-10 rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Participants ({ev.registered_count})
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                            className="h-10 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-950">
                {editingEvent ? "Edit Event Details" : "Publish New Campus Event"}
              </h3>
              <button onClick={resetEventForm} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Campus Hackathon 2026"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Provide event details, schedule, requirements..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Academic">Academic</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Auditorium Hall B"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    value={eventDeadline}
                    onChange={(e) => setEventDeadline(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Max Capacity (Seats)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Event Banner Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-slate-700"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="h-11 rounded-xl bg-slate-950 px-5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {isActionLoading ? "Saving..." : editingEvent ? "Update Event" : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER UPLOAD MODAL */}
      {bannerUploadEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-950">Upload Banner Image</h3>
              <button onClick={() => setBannerUploadEvent(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Uploading banner for: <strong className="text-slate-900">{bannerUploadEvent.title}</strong>
            </p>

            <form onSubmit={handleUploadBannerFile} className="mt-5 space-y-4">
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-slate-700"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setBannerUploadEvent(null)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading || !bannerFile}
                  className="h-10 rounded-xl bg-slate-950 px-5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isActionLoading ? "Uploading..." : "Upload Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PARTICIPANTS MODAL */}
      {participantsModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Registered Participants</h3>
                <p className="text-xs text-slate-500">{participantsModalEvent.title}</p>
              </div>
              <button onClick={() => setParticipantsModalEvent(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3">
              {isLoadingParticipants ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading participant registrations...</div>
              ) : participantsList.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-500">
                  No student registrations yet for this event.
                </div>
              ) : (
                participantsList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{p.user?.full_name || "Student"}</p>
                      <p className="text-xs text-slate-500">{p.user?.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {p.status}
                      </span>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(p.registered_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM ADMIN MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-950">Create Custom Admin Account</h3>
              <button onClick={() => setShowAddAdminModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                ✕
              </button>
            </div>

            {adminSuccessMsg && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                {adminSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Admin Full Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="sarah.admin@campus.edu"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <PasswordField
                id="modal-admin-password"
                label="Admin Password"
                value={adminPassword}
                onChange={setAdminPassword}
                required
                placeholder="Assign password (min. 6 chars)"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="h-11 rounded-xl bg-slate-950 px-5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isActionLoading ? "Creating..." : "Create Admin Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
