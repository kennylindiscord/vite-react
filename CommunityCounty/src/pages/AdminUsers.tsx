import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type AdminUser = {
  id: string;
  email: string;
  role: "resident" | "admin";
  publicNickname: string;
  createdAt: string;
  tokenBalance: number;
};

type Tx = { id: string; amount: number; type: string; description: string; createdAt: string };

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [tx, setTx] = useState<Tx[]>([]);
  const [balance, setBalance] = useState<number>(0);

  async function loadUsers() {
    const r = await api<{ users: AdminUser[] }>("/api/admin/users");
    setUsers(r.users);
  }

  async function loadTokens(userId: string) {
    const r = await api<{ user: any; balance: number; transactions: Tx[] }>(`/api/admin/users/${userId}/tokens`);
    setBalance(r.balance);
    setTx(r.transactions);
  }

  useEffect(() => {
    if (user?.role !== "admin") return;
    loadUsers();
  }, [user?.role]);

  if (!user) return <div className="text-center py-16 text-gray-600">Sign in.</div>;
  if (user.role !== "admin") return <div className="text-center py-16 text-gray-600">Admins only.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin • Users</h1>
        <p className="text-gray-600">Manage registered users and view token history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User list */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h3 className="font-semibold text-gray-900">Users</h3>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {users.map(u => (
              <button
                key={u.id}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?.id === u.id ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={async () => {
                  setSelected(u);
                  await loadTokens(u.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{u.publicNickname}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{u.tokenBalance} tokens</div>
                    <div className="text-xs text-gray-500 capitalize">{u.role}</div>
                  </div>
                </div>
              </button>
            ))}
            {users.length === 0 && <div className="text-sm text-gray-500 py-6 text-center">No users.</div>}
          </div>
        </div>

        {/* Token history */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <h3 className="font-semibold text-gray-900">Token History</h3>
            {selected ? (
              <p className="text-sm text-gray-600">
                {selected.publicNickname} • Balance: <span className="font-semibold">{balance}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">Select a user.</p>
            )}
          </div>

          <div className="px-4 pb-4 space-y-2">
            {selected && tx.map(t => (
              <div key={t.id} className="p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">{t.description}</div>
                  <div className={`font-bold ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{t.type} • {new Date(t.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {selected && tx.length === 0 && <div className="text-sm text-gray-500 py-6 text-center">No transactions.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

