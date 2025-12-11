// src/pages/Profile.tsx
import React, { useState } from 'react';
import { createPageUrl } from '../utils';
import { Award, Save, User as UserIcon } from 'lucide-react';

const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo.resident@example.com',
  full_name: 'Demo Resident',
  neighborhood: 'Riverside',
  phone: '(555) 123-4567',
  bio: 'I love volunteering at local events and helping to improve our parks.',
  token_balance: 2450,
  role: 'resident',
  created_date: '2024-01-15T00:00:00Z',
};

type ProfileUser = typeof DEMO_USER;

type ProfileFormState = {
  full_name: string;
  neighborhood: string;
  phone: string;
  bio: string;
};

export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(DEMO_USER);
  const [formData, setFormData] = useState<ProfileFormState>({
    full_name: DEMO_USER.full_name || '',
    neighborhood: DEMO_USER.neighborhood || '',
    phone: DEMO_USER.phone || '',
    bio: DEMO_USER.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUser((prev) =>
      prev
        ? {
            ...prev,
            full_name: formData.full_name,
            neighborhood: formData.neighborhood,
            phone: formData.phone,
            bio: formData.bio,
          }
        : prev,
    );

    alert('Profile updated successfully! (demo)');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-lg text-gray-600">Manage your community profile</p>
      </div>

      {/* Token Balance Card */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Token Balance</p>
              <p className="text-3xl font-bold text-amber-600">
                {user.token_balance || 0}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-gray-900">
              {new Date(user.created_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
                placeholder="Which neighborhood do you live in?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-gray-500">
                Your phone number is only used for county notifications and is not
                shown on public pages.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us a bit about yourself..."
                className="min-h-24"
              />
            </div>

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Account Role</span>
            <span className="font-semibold text-gray-900 capitalize">
              {user.role}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Member ID</span>
            <span className="font-mono text-sm text-gray-900">
              {user.id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Account Created</span>
            <span className="font-semibold text-gray-900">
              {new Date(user.created_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Minimal UI helpers */

type SimpleProps = {
  className?: string;
  children: React.ReactNode;
};

function Card({ className = '', children }: SimpleProps) {
  return (
    <div className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', children }: SimpleProps) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}

function CardContent({ className = '', children }: SimpleProps) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

function CardTitle({ className = '', children }: SimpleProps) {
  return <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

function Button({ className = '', children, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
};

function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

