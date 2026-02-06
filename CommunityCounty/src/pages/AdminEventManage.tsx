import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type RegRow = {
  userId: string;
  nickname: string;
  email: string;
  registeredAt: string;
  attendedAt: string | null;
};

export default function AdminEventManage() {
  const { user } = useAuth();
  const { eventId } = useParams();
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<RegRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ event: any; registrations: RegRow[] }>(`/api/events/${eventId}/registrations`);
      setTitle(r.event.title);
      setRows(r.registrations);
    } finally {
      setLoading(false);
    }
  }

  async function checkIn(userId: string) {
    await api(`/api/events/${eventId}/attend`, {
      method: "POST",
      body: JSON.stringify({ userId })
    });
    await load();
    alert("Checked in and rewarded tokens.");
  }

  useEffect(() => {
    if (user?.role !== "admin") return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, eventId]);

  if (!user) return <div className="text-center py-16 text-gray-600">Sign in.</div>;
  if (user.role !== "admin") return <div className="text-center py-16 text-gray-600">Admins only.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin • Event Manage</h1>
        <p className="text-gray-600">{title || "Event"} • registrations + check-in</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-600">Loading...</div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h3 className="font-semibold text-gray-900">Registrations</h3>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {rows.map(r => (
              <div key={r.userId} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{r.nickname}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                  <div className="text-xs text-gray-500">
                    Registered: {new Date(r.registeredAt).toLocaleString()}
                    {r.attendedAt ? ` • Attended: ${new Date(r.attendedAt).toLocaleString()}` : ""}
                  </div>
                </div>

                {r.attendedAt ? (
                  <span className="text-sm font-semibold text-green-700">Attended</span>
                ) : (
                  <button
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    onClick={() => checkIn(r.userId)}
                  >
                    Check-in (+tokens)
                  </button>
                )}
              </div>
            ))}

            {rows.length === 0 && <div className="text-sm text-gray-500 py-10 text-center">No registrations.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

