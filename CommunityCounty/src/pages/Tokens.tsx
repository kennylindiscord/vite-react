import React, { useEffect, useMemo, useState } from "react";
import { Award, TrendingUp, Calendar as CalendarIcon, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

type Tx = {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_date: string;
};

type MyRegItem = {
  id: string;
  event_id: string;
  status: "registered" | "attended";
  registered_date: string;
  attended_date?: string;
  event?: {
    id: string;
    title: string;
    event_date: string;
    tokens_reward: number;
  } | null;
};

const typeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  event_attendance: { icon: CalendarIcon, color: "text-blue-600", bg: "bg-blue-100" },
  post_creation: { icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  volunteer: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  reward_redemption: { icon: Award, color: "text-amber-600", bg: "bg-amber-100" },
  admin_adjustment: { icon: Award, color: "text-gray-600", bg: "bg-gray-100" },
};

export default function Tokens() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [myEvents, setMyEvents] = useState<MyRegItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const tx = await api<{ transactions: Tx[] }>("/api/tokens/transactions");
      setTransactions(tx.transactions);

      const me = await api<{ items: MyRegItem[] }>("/api/events/my/list");
      setMyEvents(me.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalEarned = useMemo(
    () => transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const totalSpent = useMemo(
    () => Math.abs(transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
    [transactions],
  );

  const currentBalance = totalEarned - totalSpent;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Tokens</h1>
        <p className="text-gray-600 mt-2">Create an account to track tokens and event history.</p>
        <div className="mt-4 flex gap-2">
          <Link className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium" to={createPageUrl("Register")}>
            Create Account
          </Link>
          <Link className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium" to={createPageUrl("Login")}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Tokens</h1>
        <p className="text-lg text-gray-600">Tokens are awarded after admin attendance check-in.</p>
      </div>

      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-center text-gray-700">Current Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Award className="h-12 w-12 text-amber-600" />
            <span className="text-6xl font-bold text-amber-600">{currentBalance}</span>
          </div>
          <p className="text-gray-600">Community Tokens</p>
        </CardContent>
      </Card>

      {/* ✅ My event participation history */}
      <Card>
        <CardHeader>
          <CardTitle>My Event Participation</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : myEvents.length === 0 ? (
            <div className="text-gray-600">
              No event activity yet. Go to <Link className="text-blue-600 font-semibold" to={createPageUrl("Events")}>Events</Link> to join one.
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.map((r) => (
                <div key={r.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{r.event?.title ?? "Event"}</p>
                    <p className="text-sm text-gray-500">
                      Joined: {format(new Date(r.registered_date), "MMM d, yyyy")}
                      {r.event?.event_date ? ` • Event: ${format(new Date(r.event.event_date), "MMM d, yyyy")}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={r.status === "attended" ? "solid" : "outline"}>
                      {r.status === "attended" ? "Attended" : "Registered"}
                    </Badge>
                    {r.status === "attended" && r.attended_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Checked-in: {format(new Date(r.attended_date), "MMM d, h:mm a")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">Total Earned</CardTitle>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totalEarned}</p>
            <p className="text-sm text-gray-600 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">Total Redeemed</CardTitle>
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{totalSpent}</p>
            <p className="text-sm text-gray-600 mt-1">All time redemptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const typeConfig = typeIcons[transaction.type] || typeIcons.admin_adjustment;
              const Icon = typeConfig.icon;
              const isEarning = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full ${typeConfig.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.created_date), "MMM d, yyyy • h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isEarning ? "text-green-600" : "text-red-600"}`}>
                      {isEarning ? "+" : ""}
                      {transaction.amount}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {transaction.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {transactions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Attend events to start earning tokens!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Small helpers */

type SimpleProps = { className?: string; children: React.ReactNode };

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

type BadgeProps = { className?: string; variant?: "solid" | "outline"; children: React.ReactNode };
function Badge({ className = "", variant = "solid", children }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";
  const styles =
    variant === "outline" ? "border-gray-300 text-gray-700 bg-white" : "border-transparent bg-gray-200 text-gray-800";
  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}

