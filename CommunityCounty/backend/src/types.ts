export type Role = "resident" | "admin";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  displayName: string;     // public nickname
  anonTag: string;         // stable anonymous tag (ex: "Sky-4F2A")
  neighborhood?: string;
  phone?: string;
  bio?: string;
  role: Role;
  createdDate: string;
  avatarUploadId?: string;
};

export type EventStatus = "upcoming" | "completed" | "cancelled";

export type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  eventDate: string;        // ISO
  category: string;         // cleanup/workshop/etc
  capacity?: number;
  tokensReward: number;
  status: EventStatus;
  imageUploadId?: string;
  createdBy: string;        // admin userId
  createdDate: string;
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
  anonymous: boolean;
  authorDisplayName: string; // what UI shows
  imageUploadId?: string;
  likes: number;
  createdDate: string;
};

export type TokenTransactionType =
  | "event_attendance"
  | "post_creation"
  | "reward_redemption"
  | "admin_adjustment";

export type TokenTransaction = {
  id: string;
  userId: string;
  amount: number;            // + earn, - spend
  type: TokenTransactionType;
  description: string;
  createdDate: string;
  meta?: Record<string, unknown>;
};

export type Upload = {
  id: string;
  mime: string;
  data: Buffer;
  createdBy: string;
  createdDate: string;
};

