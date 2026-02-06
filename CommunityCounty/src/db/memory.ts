import bcrypt from "bcryptjs";
import { anonTag, id } from "../utils/ids";
import { CommunityPost, Event, EventRegistration, TokenTransaction, Upload, User } from "../types";

class MemoryDB {
  users: User[] = [];
  events: Event[] = [];
  registrations: EventRegistration[] = [];
  posts: CommunityPost[] = [];
  transactions: TokenTransaction[] = [];
  uploads: Upload[] = [];

  constructor() {
    // Seed ONE admin so you can create events immediately.
    // Everything else starts empty.
    const adminEmail = "admin@demo.local";
    const adminPass = "Admin1234!";
    const now = new Date().toISOString();

    const admin: User = {
      id: id("usr"),
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPass, 10),
      fullName: "Demo Admin",
      displayName: "County Admin",
      anonTag: anonTag(),
      role: "admin",
      createdDate: now
    };

    this.users.push(admin);
  }

  getUserBalance(userId: string): number {
    return this.transactions
      .filter(t => t.userId === userId)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      displayName: user.displayName,
      anonTag: user.anonTag,
      neighborhood: user.neighborhood ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      role: user.role,
      createdDate: user.createdDate,
      avatarUrl: user.avatarUploadId ? `/api/uploads/${user.avatarUploadId}` : "",
      tokenBalance: this.getUserBalance(user.id)
    };
  }
}

export const db = new MemoryDB();

