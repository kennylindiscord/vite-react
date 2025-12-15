// backend/src/data/store.ts
export type EventCategory =
  | 'town_hall'
  | 'cleanup'
  | 'workshop'
  | 'festival'
  | 'sports'
  | 'education'
  | 'health'
  | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string; // ISO date string
  category: EventCategory;
  image_url?: string;
  capacity?: number;
  tokens_reward: number;
  status: EventStatus;
}

export type TokenType =
  | 'event_attendance'
  | 'post_creation'
  | 'volunteer'
  | 'reward_redemption'
  | 'admin_adjustment';

export interface TokenTransaction {
  id: string;
  user_email: string;
  amount: number;
  type: TokenType;
  description: string;
  created_date: string; // ISO date string
}

export type PostCategory =
  | 'announcement'
  | 'discussion'
  | 'question'
  | 'idea'
  | 'news';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  author_email: string;
  author_name: string;
  image_url?: string;
  likes: number;
  created_date: string; // ISO date string
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_email: string;
  status: 'registered' | 'attended' | 'cancelled';
  created_date: string;
  attended_at?: string;
}

// simple id helper (no extra libs)
export function createId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

// --- In-memory data (demo only) ---

export const events: Event[] = [
  {
    id: '1',
    title: 'Neighborhood Clean-up',
    description: 'Help clean up Riverside Park and earn tokens for your contribution.',
    location: 'Riverside Park',
    event_date: '2025-12-20T10:00:00Z',
    category: 'cleanup',
    image_url: '',
    capacity: 40,
    tokens_reward: 150,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Teen Coding Night',
    description: 'Learn the basics of web development in a fun, hands-on workshop.',
    location: 'Community Tech Center',
    event_date: '2025-12-22T18:00:00Z',
    category: 'workshop',
    image_url: '',
    capacity: 30,
    tokens_reward: 100,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Holiday Festival',
    description: 'Celebrate the season with music, food, and local vendors.',
    location: 'Main Square',
    event_date: '2025-12-24T16:00:00Z',
    category: 'festival',
    image_url: '',
    capacity: 200,
    tokens_reward: 80,
    status: 'upcoming',
  },
];

export const tokenTransactions: TokenTransaction[] = [
  {
    id: 'tx-1',
    user_email: 'demo.resident@example.com',
    amount: 150,
    type: 'event_attendance',
    description: 'Neighborhood Clean-up',
    created_date: '2025-12-20T12:00:00Z',
  },
  {
    id: 'tx-2',
    user_email: 'demo.resident@example.com',
    amount: 100,
    type: 'event_attendance',
    description: 'Teen Coding Night',
    created_date: '2025-12-22T20:00:00Z',
  },
  {
    id: 'tx-3',
    user_email: 'demo.resident@example.com',
    amount: -80,
    type: 'reward_redemption',
    description: 'Discount at local café',
    created_date: '2025-12-23T10:30:00Z',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Welcome to the Community Board',
    content: 'Feel free to share updates, ask questions, and post ideas here.',
    category: 'announcement',
    author_email: 'staff@example.com',
    author_name: 'County Staff',
    image_url: '',
    likes: 3,
    created_date: '2025-12-03T10:00:00Z',
  },
];

export const eventRegistrations: EventRegistration[] = [];

// --- helper functions for other routes ---

export function addTokenTransaction(input: Omit<TokenTransaction, 'id' | 'created_date'>) {
  const tx: TokenTransaction = {
    id: createId(),
    created_date: new Date().toISOString(),
    ...input,
  };
  // newest first
  tokenTransactions.unshift(tx);
  return tx;
}

export function registerForEvent(params: {
  eventId: string;
  userEmail: string;
}) {
  const registration: EventRegistration = {
    id: createId(),
    event_id: params.eventId,
    user_email: params.userEmail,
    status: 'registered',
    created_date: new Date().toISOString(),
  };
  eventRegistrations.unshift(registration);
  return registration;
}

