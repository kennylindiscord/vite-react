import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createPageUrl } from "../utils";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
      <p className="text-gray-600 mt-1">Register once, then join events and earn tokens.</p>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      <div className="mt-6 space-y-3">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Full name"
          value={full_name} onChange={(e) => setFullName(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700"
          onClick={async () => {
            setErr("");
            try {
              await register(email, password, full_name);
              nav(createPageUrl("Home"));
            } catch (e: any) {
              setErr(e?.message ?? "Register failed");
            }
          }}
        >
          Create Account
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Already have one?{" "}
        <Link className="text-blue-600 font-semibold" to={createPageUrl("Login")}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

