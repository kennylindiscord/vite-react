import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Heart, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Post = {
  id: string;
  title: string;
  content: string;
  category: "announcement" | "discussion" | "question" | "idea" | "news";
  author_name: string;
  author_nickname: string;
  image_url?: string;
  likes: number;
  created_date: string;
};

const categoryColors: Record<string, string> = {
  announcement: "bg-blue-100 text-blue-800",
  discussion: "bg-purple-100 text-purple-800",
  question: "bg-green-100 text-green-800",
  idea: "bg-amber-100 text-amber-800",
  news: "bg-red-100 text-red-800",
};

export default function Community() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "discussion" as Post["category"],
  });
  const [loading, setLoading] = useState(true);

  const allowedCategories = useMemo(() => {
    const base: Post["category"][] = ["discussion", "question", "idea", "news"];
    if (user?.role === "admin") base.unshift("announcement");
    return base;
  }, [user?.role]);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ posts: Post[] }>("/api/community/posts");
      setPosts(res.posts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreatePost() {
    if (!user) {
      alert("Please sign in or create an account first.");
      return;
    }
    if (!newPost.title || !newPost.content) {
      alert("Please fill in all fields.");
      return;
    }

    await api<{ post: Post }>("/api/community/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
    });

    setShowCreateForm(false);
    setNewPost({ title: "", content: "", category: allowedCategories[0] });
    await load();
  }

  async function like(postId: string) {
    if (!user) {
      alert("Please sign in or create an account first.");
      return;
    }
    await api(`/api/community/posts/${postId}/like`, { method: "POST" });
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Board</h1>
          <p className="text-lg text-gray-600">Connect and share with your neighbors</p>
        </div>

        {user && (
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showCreateForm ? (
              <>
                <X className="h-4 w-4 mr-2" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> New Post
              </>
            )}
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <p className="text-sm text-gray-600">
              Announcement is admin-only. Other categories are available for all members.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="min-h-32"
            />

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-2">
                {allowedCategories.map((category) => (
                  <Badge
                    key={category}
                    className={
                      newPost.category === category
                        ? categoryColors[category]
                        : "bg-gray-200 text-gray-700"
                    }
                    onClick={() => setNewPost({ ...newPost, category })}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleCreatePost} className="w-full">
              Post to Community
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading posts…</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={categoryColors[post.category] || categoryColors.discussion}>
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(post.created_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      By {post.author_name} · <span className="text-gray-500">{post.author_nickname}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full rounded-lg" />
                )}

                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => like(post.id)}>
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes || 0} Likes
                  </Button>

                  <Button variant="ghost" size="sm" className="text-gray-600" disabled>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment (later)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
            </div>
          )}
        </div>
      )}

      {!user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <p className="text-gray-700 mb-4">
              Create an account to post and like community updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* Minimal UI helpers (same style as your originals) */

type SimpleProps = { className?: string; children: React.ReactNode };

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
  size?: "sm" | "md";
};

function Button({ className = "", variant = "solid", size = "md", children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const styles =
    variant === "ghost" ? "bg-transparent hover:bg-gray-100 text-gray-700" : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <button className={`${base} ${styles} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ className = "", children }: SimpleProps) {
  return <div className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ className = "", children }: SimpleProps) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }: SimpleProps) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}
function CardTitle({ className = "", children }: SimpleProps) {
  return <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

type BadgeProps = { className?: string; children: React.ReactNode; onClick?: () => void };
function Badge({ className = "", children, onClick }: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer ${className}`}
    >
      {children}
    </span>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`}
    />
  );
}

