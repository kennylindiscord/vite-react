import React, { useEffect, useMemo, useState } from "react";
import { Users, Calendar, Award, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { apiJSON } from "../api/http";
import { useAuth } from "../auth/AuthContext";

type Stats = {
  membersCount: number;
  eventsCount: number;
  postsCount: number;
  tokensInCirculation: number;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location?: string;
  category: string;
  tokensReward: number;
  status: "upcoming" | "completed" | "cancelled";
  registeredCount: number;
  capacity?: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  category: "announcement" | "discussion" | "question" | "idea" | "news";
  authorDisplayName: string;
  createdDate: string;
};

export default function Home() {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, postsRes] = await Promise.all([
        apiJSON<Stats>("/api/stats"),
        apiJSON<{ events: EventItem[] }>("/api/events"),
        apiJSON<{ posts: Post[] }>("/api/community/posts?limit=6")
      ]);

      setStats(statsRes);
      setEvents(eventsRes.events);
      setPosts(postsRes.posts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => e.status === "upcoming" && new Date(e.eventDate).getTime() >= now)
      .sort((a, b) => +new Date(a.eventDate) - +new Date(b.eventDate))
      .slice(0, 3);
  }, [events]);

  const highlights = useMemo(() => {
    // prefer announcements first (admin posts)
    const sorted = posts.slice().sort((a, b) => {
      const aAnn = a.category === "announcement" ? 1 : 0;
      const bAnn = b.category === "announcement" ? 1 : 0;
      if (aAnn !== bAnn) return bAnn - aAnn;
      return +new Date(b.createdDate) - +new Date(a.createdDate);
    });
    return sorted.slice(0, 3);
  }, [posts]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-gradient-to-br from-blue-600 to-green-600 text-white">
          <h1 className="text-4xl font-bold mb-2">County Community Portal</h1>
          <p className="text-white/90 text-lg">
            Real data powered by the backend: events, posts, tokens, and member stats.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/events"
              className="inline-flex items-center rounded-lg bg-white text-blue-700 px-4 py-2 text-sm font-semibold hover:bg-white/90"
            >
              Browse Events <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center rounded-lg bg-white/10 text-white px-4 py-2 text-sm font-semibold hover:bg-white/15 border border-white/20"
            >
              Community Board <MessageSquare className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {!user && (
            <p className="mt-4 text-sm text-white/90">
              Sign in to register for events and track your token history.
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Members"
          value={stats?.membersCount ?? (loading ? "…" : "0")}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Events"
          value={stats?.eventsCount ?? (loading ? "…" : "0")}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          title="Posts"
          value={stats?.postsCount ?? (loading ? "…" : "0")}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          title="Tokens (Circulation)"
          value={stats?.tokensInCirculation ?? (loading ? "…" : "0")}
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      {/* Upcoming + Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Link to="/events" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-gray-500">Loading…</p>}
            {!loading && upcoming.length === 0 && (
              <p className="text-gray-500">No upcoming events yet. (Admin can create events.)</p>
            )}
            {!loading &&
              upcoming.map((e) => (
                <div key={e.id} className="rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{e.title}</p>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      +{e.tokensReward}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{e.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(e.eventDate).toLocaleString()}
                    {e.location ? ` • ${e.location}` : ""}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Community Highlights</CardTitle>
            <Link to="/community" className="text-sm text-blue-600 hover:underline">
              View board
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-gray-500">Loading…</p>}
            {!loading && highlights.length === 0 && (
              <p className="text-gray-500">No posts yet. (Admin can post announcements/highlights.)</p>
            )}
            {!loading &&
              highlights.map((p) => (
                <div key={p.id} className="rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(p.createdDate).toLocaleDateString()} • {p.authorDisplayName}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* small UI bits */

function StatCard({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="text-gray-500">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">{children}</div>;
}
function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}
function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pb-4">{children}</div>;
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-gray-900">{children}</h3>;
}

