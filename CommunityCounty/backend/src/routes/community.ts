import { Router } from "express";
import { db, PostCategory } from "../db/memory";
import requireAuth from "../middleware/requireAuth";

const router = Router();

router.get("/posts", (req, res) => {
  const limit = Number(req.query.limit || 50);
  const posts = db.listPosts(limit).map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category,
    author_name: p.authorName,
    image_url: p.imageUrl || "",
    likes: p.likes,
    created_date: p.createdAt,
  }));
  return res.json({ posts });
});

// Registered users can post; but announcement only admin
router.post("/posts", requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { title, content, category, image_url } = req.body || {};
    const cat = (category || "discussion") as PostCategory;

    if (cat === "announcement" && user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can post announcements." });
    }

    const post = db.createPost(user.id, {
      title,
      content,
      category: cat,
      imageUrl: image_url || "",
    });

    return res.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        author_name: post.authorName,
        image_url: post.imageUrl || "",
        likes: post.likes,
        created_date: post.createdAt,
      },
    });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Create post failed" });
  }
});

router.post("/posts/:id/like", requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const post = db.toggleLike(req.params.id, user.id);
    return res.json({ likes: post.likes });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Like failed" });
  }
});

export default router;

