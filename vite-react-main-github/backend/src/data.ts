// src/data.ts

export type UserRole = 'resident' | 'staff' | 'admin';

export type User = {
  id: string;
  email: string;
  full_name: string;
  neighborhood?: string;
  phone?: string;
  token_balance: number;
  role: UserRole;
  created_at: string;
};

export type EventStatus = 'upcoming' | 'completed';

export type Event = {
  id: string;
  title: string;
  description: string;
  location?: string;
  event_date: string;
  category: string;
  image_url?: string;
  capacity?: number;
  tokens_reward: number;
  status: EventStatus;
};

export type TokenTransactionType =
  | 'event_attendance'
  | 'post_creation'
  | 'volunteer'
  | 'reward_redemption'
  | 'admin_adjustment';

export type TokenTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TokenTransactionType;
  description: string;
  reference_id?: string;
  created_at: string;
};

export type VisibilityMode = 'real_name' | 'nickname' | 'anonymous';

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  author_user_id: string;
  author_display_name: string;
  visibility_mode: VisibilityMode;
  image_url?: string;
  likes_count: number;
  created_at: string;
};

export type ParticipationLog = {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  created_at: string;
};

// ===== In-memory "database" =====

export const users: User[] = [
  {
    id: 'demo-user-1',
    email: 'demo.resident@example.com',
    full_name: 'Demo Resident',
    neighborhood: 'Riverside',
    phone: '(555) 123-4567',
    token_balance: 2450,
    role: 'resident',
    created_at: '2024-01-15T00:00:00Z',
  },
];

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
    user_id: 'demo-user-1',
    amount: 150,
    type: 'event_attendance',
    description: 'Neighborhood Clean-up',
    created_at: '2025-12-20T12:00:00Z',
  },
  {
    id: 'tx-2',
    user_id: 'demo-user-1',
    amount: 100,
    type: 'event_attendance',
    description: 'Teen Coding Night',
    created_at: '2025-12-22T20:00:00Z',
  },
  {
    id: 'tx-3',
    user_id: 'demo-user-1',
    amount: -80,
    type: 'reward_redemption',
    description: 'Discount at local café',
    created_at: '2025-12-23T10:30:00Z',
  },
];

export const participationLogs: ParticipationLog[] = [];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Welcome to the Community Board',
    content: 'Feel free to share updates, ask questions, and post ideas here.',
    category: 'announcement',
    author_user_id: 'staff-1',
    author_display_name: 'County Staff',
    visibility_mode: 'real_name',
    image_url: '',
    likes_count: 3,
    created_at: '2025-12-03T10:00:00Z',
  },
];

// simple id generator
let idCounter = 1000;
export function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

