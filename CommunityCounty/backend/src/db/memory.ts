import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export type Role = "resident" | "admin";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  publicName: string; // anonymous-ish display name
  neighborhood?: string;
  phone?: string;
  bio?: string;
  role: Role;
  tokenBalance: number;
  createdAt: string;
};

export type EventStatus = "upcoming" | "completed" | "cancelled";

export type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  eventDate: string; // ISO
  category: string;
  imageUrl?: string;
  capacity?: number;
  tokensReward: number;
  status: EventStatus;
  createdAt: string;
  createdBy: string; // admin user id
};

export type RegistrationStatus = "registered" | "attended";

export type Registration = {
  id: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
  registeredAt: string;
  attendedAt?: string;
};

export type PostCategory = "announcement" | "discussion" | "question" | "idea" | "news";

export type Post = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  authorName: string; // publicName
  createdAt: string;
  likes: number;
  likedBy: Set<string>;
  imageUrl?: string;
};

export type TokenTxType =
  | "event_attendance"
  | "post_creation"
  | "admin_adjustment";

export type TokenTransaction = {
  id: string;
  userId: string;
  amount: number; // + or -
  type: TokenTxType;
  description: string;
  createdAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function createPublicName() {
  const adj = ["Sunny", "Kind", "Brave", "Calm", "Swift", "Bright", "Gentle", "Clever"];
  const noun = ["Otter", "Fox", "Robin", "Koala", "Panda", "Dolphin", "Hawk", "Deer"];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${a} ${n} ${num}`;
}

class MemoryDB {
  users = new Map<string, User>();
  events = new Map<string, Event>();
  registrations = new Map<string, Registration>(); // regId -> reg
  posts = new Map<string, Post>();
  tokenTx = new Map<string, TokenTransaction>();

  // --- USERS ---
  async createUser(input: { email: string; password: string; fullName?: string; role?: Role }) {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) throw new Error("Email and password are required.");

    const exists = [...this.users.values()].some((u) => u.email === email);
    if (exists) throw new Error("Email already in use.");

    const user: User = {
      id: randomUUID(),
      email,
      passwordHash: await bcrypt.hash(input.password, 10),
      fullName: input.fullName?.trim() || "Community Member",
      publicName: createPublicName(),
      role: input.role || "resident",
      tokenBalance: 0,
      createdAt: nowIso(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async verifyUser(email: string, password: string) {
    const e = email.trim().toLowerCase();
    const user = [...this.users.values()].find((u) => u.email === e);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  getUserById(userId: string) {
    return this.users.get(userId) || null;
  }

  safeUser(u: User) {
    return {
      id: u.id,
      email: u.email,
      full_name: u.fullName,
      public_name: u.publicName,
      neighborhood: u.neighborhood || "",
      phone: u.phone || "",
      bio: u.bio || "",
      role: u.role,
      token_balance: u.tokenBalance,
      created_date: u.createdAt,
    };
  }

  updateUserProfile(userId: string, patch: Partial<Pick<User, "fullName" | "neighborhood" | "phone" | "bio">>) {
    const u = this.users.get(userId);
    if (!u) throw new Error("User not found.");
    if (typeof patch.fullName === "string") u.fullName = patch.fullName;
    if (typeof patch.neighborhood === "string") u.neighborhood = patch.neighborhood;
    if (typeof patch.phone === "string") u.phone = patch.phone;
    if (typeof patch.bio === "string") u.bio = patch.bio;
    this.users.set(u.id, u);
    return u;
  }

  // --- EVENTS ---
  createEvent(adminId: string, input: Omit<Event, "id" | "createdAt" | "createdBy">) {
    const e: Event = {
      id: randomUUID(),
      createdAt: nowIso(),
      createdBy: adminId,
      ...input,
    };
    this.events.set(e.id, e);
    return e;
  }

  listEvents() {
    return [...this.events.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getEvent(eventId: string) {
    return this.events.get(eventId) || null;
  }

  registerForEvent(userId: string, eventId: string) {
    const ev = this.getEvent(eventId);
    if (!ev) throw new Error("Event not found.");
    if (ev.status !== "upcoming") throw new Error("Event is not open for registration.");

    const regs = [...this.registrations.values()].filter((r) => r.eventId === eventId);
    const already = regs.find((r) => r.userId === userId);
    if (already) return already;

    if (typeof ev.capacity === "number" && ev.capacity > 0) {
      const registeredCount = regs.filter((r) => r.status === "registered" || r.status === "attended").length;
      if (registeredCount >= ev.capacity) throw new Error("Event is full.");
    }

    const reg: Registration = {
      id: randomUUID(),
      userId,
      eventId,
      status: "registered",
      registeredAt: nowIso(),
    };
    this.registrations.set(reg.id, reg);
    return reg;
  }

  listUserRegistrations(userId: string) {
    return [...this.registrations.values()]
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
  }

  listEventRegistrations(eventId: string) {
    return [...this.registrations.values()]
      .filter((r) => r.eventId === eventId)
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
  }

  // Admin check-in: mark attended + add tokens
  checkInUser(adminId: string, userId: string, eventId: string) {
    const admin = this.getUserById(adminId);
    if (!admin || admin.role !== "admin") throw new Error("Admin only.");

    const ev = this.getEvent(eventId);
    if (!ev) throw new Error("Event not found.");

    const reg = [...this.registrations.values()].find((r) => r.userId === userId && r.eventId === eventId);
    if (!reg) throw new Error("User is not registered for this event.");
    if (reg.status === "attended") return reg; // already attended

    reg.status = "attended";
    reg.attendedAt = nowIso();
    this.registrations.set(reg.id, reg);

    // token reward
    this.addTokens(userId, ev.tokensReward, "event_attendance", ev.title);
    return reg;
  }

  // --- COMMUNITY POSTS ---
  createPost(userId: string, input: { title: string; content: string; category: PostCategory; imageUrl?: string }) {
    const u = this.getUserById(userId);
    if (!u) throw new Error("User not found.");

    const post: Post = {
      id: randomUUID(),
      title: input.title,
      content: input.content,
      category: input.category,
      authorId: userId,
      authorName: u.publicName,
      createdAt: nowIso(),
      likes: 0,
      likedBy: new Set<string>(),
      imageUrl: input.imageUrl || "",
    };

    this.posts.set(post.id, post);

    // reward: post creation (optional; keep 0 if you don't want reward)
    // this.addTokens(userId, 5, "post_creation", "Created a community post");

    return post;
  }

  listPosts(limit = 50) {
    const all = [...this.posts.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return all.slice(0, Math.max(1, limit));
  }

  toggleLike(postId: string, userId: string) {
    const p = this.posts.get(postId);
    if (!p) throw new Error("Post not found.");
    if (p.likedBy.has(userId)) {
      p.likedBy.delete(userId);
      p.likes = Math.max(0, p.likes - 1);
    } else {
      p.likedBy.add(userId);
      p.likes += 1;
    }
    this.posts.set(p.id, p);
    return p;
  }

  // --- TOKENS ---
  addTokens(userId: string, amount: number, type: TokenTxType, description: string) {
    const u = this.getUserById(userId);
    if (!u) throw new Error("User not found.");
    u.tokenBalance += amount;

    const tx: TokenTransaction = {
      id: randomUUID(),
      userId,
      amount,
      type,
      description,
      createdAt: nowIso(),
    };

    this.users.set(u.id, u);
    this.tokenTx.set(tx.id, tx);
    return tx;
  }

  listUserTransactions(userId: string) {
    return [...this.tokenTx.values()]
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // --- STATS ---
  getStats() {
    const membersCount = [...this.users.values()].filter((u) => u.role !== "admin").length;
    const eventsCount = this.events.size;
    const tokenCount = [...this.users.values()].reduce((sum, u) => sum + u.tokenBalance, 0);
    return { membersCount, eventsCount, tokenCount };
  }
}

export const db = new MemoryDB();

/**
 * Seeds ONLY the admin account; everything else stays empty ("clear state").
 */
export async function seedAdmin() {
  const adminEmail = "admin@county.local";
  const existing = [...db.users.values()].find((u) => u.email === adminEmail);
  if (existing) return existing;

  const admin = await db.createUser({
    email: adminEmail,
    password: "Admin123!",
    fullName: "County Admin",
    role: "admin",
  });
  return admin;
}

