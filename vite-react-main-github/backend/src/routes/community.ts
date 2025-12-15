// backend/src/routes/community.ts
import { Router, Request, Response } from 'express';
import {
  communityPosts,
  addTokenTransaction,
  createId,
} from '../data/store';

const router = Router();

// GET /api/community/posts?limit=3
router.get('/posts', (req: Request, res: Response) => {
  const { limit } = req.query;

  let posts = [...communityPosts].sort((a, b) =>
    b.created_date.localeCompare(a.created_date),
  );

  if (typeof limit === 'string') {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n)) {
      posts = posts.slice(0, n);
    }
  }

  res.json(posts);
});

// POST /api/community/posts
// body: { title, content, category, author_email, author_name }
router.post('/posts', (req: Request, res: Response) => {
  const { title, content, category, author_email, author_name } = req.body as {
    title?: string;
    content?: string;
    category?: string;
    author_email?: string;
    author_name?: string;
  };

  if (!title || !content || !category || !author_email || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newPost = {
    id: createId(),
    title,
    content,
    category,
    author_email,
    author_name,
    image_url: '',
    likes: 0,
    created_date: new Date().toISOString(),
  };

  communityPosts.unshift(newPost);

  // +5 tokens for posting, in a real system this would be more strict/authenticated
  addTokenTransaction({
    user_email: author_email,
    amount: 5,
    type: 'post_creation',
    description: 'Created a community post',
  });

  return res.status(201).json(newPost);
});

export default router;

