export type Role = "resident" | "admin";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  nickname: string; // public display name (anonymous-friendly)
  neighborhood?: string;
  phone?: string;
  bio?: string;
  role: Role;
  createdAt: string;
};

export type EventStatus = "upcoming" | "completed";

export type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  eventDate: string; // ISO
  category: string;
  imageUrl?: string;
  capacity?: number;
  tokensReward: number; // granted ONLY when attended (check-in)
  status: EventStatus;
  createdAt: string;
  createdBy: string; // admin userId
};

export type RegistrationStatus = "registered" | "attended";

export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt: string;
  attendedAt?: string;
};

export type CommunityCategory = "discussion" | "question" | "idea" | "news" | "announcement";

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  authorId: string;
  authorNickname: string;
  imageUrl?: string;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
};

export type TokenTransactionType =
  | "event_attendance"
  | "admin_adjustment"
  | "reward_redemption"
  | "post_creation";

export type TokenTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: TokenTransactionType;
  description: string;
  createdAt: string;
  meta?: Record<string, any>;
};

