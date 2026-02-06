import React, { useEffect, useState } from "react";
import { Award, Save, User as UserIcon } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function Profile() {
  const { user, refreshMe } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    neighborhood: "",
    phone: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        neighborhood: user.neighborhood || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Create an account to manage your profile.</p>
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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      await refreshMe();
      alert("Profile updated!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-lg text-gray-600">Manage your community profile</p>
      </div>

      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Token Balance</p>
              <p className="text-3xl font-bold text-amber-600">{user.token_balance || 0}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-gray-900">
              {new Date(user.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={save} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-100 cursor-not-allowed" />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Which neighborhood do you live in?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-gray-500">Phone is private for notifications (not public).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                className="min-h-24"
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* Minimal UI helpers */

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

function Button({ className = "", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60";
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`}
    />
  );
}

