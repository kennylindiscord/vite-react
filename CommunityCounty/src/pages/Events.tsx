import React, { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Users, Award, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  event_date: string;
  category: string;
  image_url?: string;
  capacity?: number;
  tokens_reward: number;
  status: "upcoming" | "completed" | "cancelled";
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Events",
  town_hall: "Town Hall",
  cleanup: "Cleanup",
  workshop: "Workshop",
  festival: "Festival",
};

const categoryColors: Record<string, string> = {
  town_hall: "bg-blue-100 text-blue-800",
  cleanup: "bg-green-100 text-green-800",
  workshop: "bg-purple-100 text-purple-800",
  festival: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Events() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | string>("all");
  const [myRegs, setMyRegs] = useState<Record<string, "registered" | "attended">>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ events: Event[] }>("/api/events");
      setEvents(res.events);

      if (user) {
        const my = await api<{ items: any[] }>("/api/events/my/list");
        const map: Record<string, "registered" | "attended"> = {};
        for (const r of my.items) map[r.event_id] = r.status;
        setMyRegs(map);
      } else {
        setMyRegs({});
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const isRegistered = (eventId: string) => !!myRegs[eventId];

  async function joinEvent(eventId: string) {
    if (!user) {
      nav(createPageUrl("Register"));
      return;
    }
    await api(`/api/events/${eventId}/register`, { method: "POST" });
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Events</h1>
        <p className="text-lg text-gray-600">
          Join events. Tokens are awarded after admin check-in.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-white border border-gray-200 p-1">
          {["all", "town_hall", "cleanup", "workshop", "festival"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedCategory(value)}
              className={`px-3 py-1 text-sm rounded-full mx-1 ${
                selectedCategory === value ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {CATEGORY_LABELS[value] ?? value}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading events…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const registered = isRegistered(event.id);
            const status = myRegs[event.id];

            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-green-400 relative">
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>+{event.tokens_reward}</span>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={categoryColors[event.category] || categoryColors.other}>
                      {event.category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {format(new Date(event.event_date), "MMM d, yyyy • h:mm a")}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        {event.location}
                      </div>
                    )}
                    {event.capacity && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-purple-600" />
                        Max {event.capacity} participants
                      </div>
                    )}
                  </div>

                  {registered ? (
                    <Button disabled className="w-full" variant="secondary">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {status === "attended" ? "Attended" : "Joined"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => joinEvent(event.id)}
                      disabled={event.status !== "upcoming"}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Join Event
                    </Button>
                  )}

                  {!user && (
                    <p className="text-xs text-gray-500">
                      You need an account to join. <Link className="text-blue-600 font-semibold" to={createPageUrl("Register")}>Create one</Link>.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
          <p className="text-gray-500">Check back later for upcoming community events.</p>
        </div>
      )}
    </div>
  );
}

/* Minimal UI helpers */

type SimpleProps = { className?: string; children: React.ReactNode };
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" };

function Button({ className = "", variant = "primary", children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const styles =
    variant === "secondary" ? "bg-gray-100 text-gray-700 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ className = "", children }: SimpleProps) {
  return <div className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ className = "", children }: SimpleProps) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }: SimpleProps) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}
function CardTitle({ className = "", children }: SimpleProps) {
  return <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>;
}
function Badge({ className = "", children }: SimpleProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

