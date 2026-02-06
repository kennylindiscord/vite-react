// src/routes.ts
import express from 'express';
import {
  users,
  events,
  tokenTransactions,
  participationLogs,
  communityPosts,
  nextId,
} from './data';
import { generateRandomAnonName } from './anon';

const router = express.Router();

// temporary auth – always demo-user-1
function getCurrentUserId(): string {
  return 'demo-user-1';
}

// GET /api/me
router.get('/me', (req, res) => {
  const userId = getCurrentUserId();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

// GET /api/events
router.get('/events', (req, res) => {
  return res.json(events);
});

// POST /api/events/:id/register
router.post('/events/:id/register', (req, res) => {
  const userId = getCurrentUserId();
  const eventId = req.params.id;

  const event = events.find((e) => e.id === eventId);
  if (!event || event.status !== 'upcoming') {
    return res.status(400).json({ error: 'Event not available.' });
  }

  participationLogs.push({
    id: nextId('log'),
    user_id: userId,
    action_type: 'EVENT_REGISTER',
    entity_type: 'event',
    entity_id: eventId,
    created_at: new Date().toISOString(),
  });

  return res.json({ ok: true, message: 'Registered (demo, no DB).' });
});

// GET /api/token/transactions
router.get('/token/transactions', (req, res) => {
  const userId = getCurrentUserId();
  const list = tokenTransactions.filter((t) => t.user_id === userId);
  return res.json(list);
});

// GET /api/community/posts
router.get('/community/posts', (req, res) => {
  const result = communityPosts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    author_display_name: post.author_display_name,
    visibility_mode: post.visibility_mode,
    image_url: post.image_url,
    likes_count: post.likes_count,
    created_at: post.created_at,
  }));
  return res.json(result);
});

// POST /api/community/posts
router.post('/community/posts', (req, res) => {
  const userId = getCurrentUserId();
  const { title, content, category, visibility_mode } = req.body as {
    title: string;
    content: string;
    category?: string;
    visibility_mode?: 'real_name' | 'nickname' | 'anonymous';
  };

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const mode = visibility_mode || 'anonymous';

  let authorDisplayName: string;
  if (mode === 'real_name') {
    authorDisplayName = user.full_name;
  } else if (mode === 'nickname') {
    authorDisplayName = user.full_name; // later: separate nickname field
  } else {
    authorDisplayName = generateRandomAnonName();
  }

  const now = new Date().toISOString();
  const newPost = {
    id: nextId('post'),
    title,
    content,
    category: category || 'discussion',
    author_user_id: userId,
    author_display_name: authorDisplayName,
    visibility_mode: mode,
    image_url: '',
    likes_count: 0,
    created_at: now,
  };

  communityPosts.unshift(newPost);

  participationLogs.push({
    id: nextId('log'),
    user_id: userId,
    action_type: 'POST_CREATE',
    entity_type: 'post',
    entity_id: newPost.id,
    created_at: now,
  });

  tokenTransactions.push({
    id: nextId('tx'),
    user_id: userId,
    amount: 5,
    type: 'post_creation',
    description: 'Created a community post',
    reference_id: newPost.id,
    created_at: now,
  });

  user.token_balance += 5;

  return res.status(201).json({
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    category: newPost.category,
    author_display_name: newPost.author_display_name,
    visibility_mode: newPost.visibility_mode,
    image_url: newPost.image_url,
    likes_count: newPost.likes_count,
    created_at: newPost.created_at,
  });
});

export default router;

