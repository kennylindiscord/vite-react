// src/pages/Community.tsx
import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

const DEMO_USER = {
  email: 'demo.resident@example.com',
  full_name: 'Demo Resident',
};

type PostCategory = 'announcement' | 'discussion' | 'question' | 'idea' | 'news';

type Post = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  author_email: string;
  author_name: string;
  image_url?: string;
  likes: number;
  created_date: string;
};

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
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

const categoryColors: Record<string, string> = {
  announcement: 'bg-blue-100 text-blue-800',
  discussion: 'bg-purple-100 text-purple-800',
  question: 'bg-green-100 text-green-800',
  idea: 'bg-amber-100 text-amber-800',
  news: 'bg-red-100 text-red-800',
};

export default function Community() {
  const [user] = useState(DEMO_USER); // replace with real auth state later
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'discussion' as PostCategory,
  });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadError(null);
        const res = await fetch('/api/community/posts');
        if (!res.ok) {
          throw new Error('Failed to load posts');
        }
        const data = (await res.json()) as Post[];
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
        setLoadError('Could not load posts from the server. Showing demo post instead.');
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          author_email: user.email,
          author_name: user.full_name,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const created = (await res.json()) as Post;
      setPosts((prev) => [created, ...prev]);
      setShowCreateForm(false);
      setNewPost({ title: '', content: '', category: 'discussion' });
      alert('Post created! (+5 tokens in a real system)');
    } catch (err) {
      console.error(err);
      alert('Could not create post. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Board</h1>
          <p className="text-lg text-gray-600">Connect and share with your neighbors</p>
          {loadError && (
            <p className="mt-1 text-sm text-red-600">{loadError}</p>
          )}
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

      {/* Create Post Form */}
      {showCreateForm && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <p className="text-sm text-gray-600">
              Share your thoughts with the community (+5 tokens in a real system)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="min-h-32"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex flex-wrap gap-2">
                {(['announcement', 'discussion', 'question', 'idea', 'news'] as PostCategory[]).map(
                  (category) => (
                    <Badge
                      key={category}
                      className={
                        newPost.category === category
                          ? categoryColors[category]
                          : 'bg-gray-200 text-gray-700'
                      }
                      onClick={() => setNewPost({ ...newPost, category })}
                    >
                      {category}
                    </Badge>
                  ),
                )}
              </div>
            </div>
            <Button onClick={handleCreatePost} className="w-full" disabled={creating}>
              {creating ? 'Posting...' : 'Post to Community'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      className={categoryColors[post.category] || categoryColors.discussion}
                    >
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {format(new Date(post.created_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    By {post.author_name || 'Community Member'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              )}

              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Heart className="h-4 w-4 mr-2" />
                  {post.likes || 0} Likes
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
          {user && (
            <Button onClick={() => setShowCreateForm(true)}>
              Create First Post
            </Button>
          )}
        </div>
      )}

      {!user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <p className="text-gray-700 mb-4">
              Sign in to create posts and engage with the community.
            </p>
            <Button onClick={() => alert('TODO: connect sign-in flow')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* Minimal UI helpers */

type SimpleProps = {
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost';
  size?: 'sm' | 'md';
};

function Button({
  className = '',
  variant = 'solid',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const styles =
    variant === 'ghost'
      ? 'bg-transparent hover:bg-gray-100 text-gray-700'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';
  return (
    <button className={`${base} ${styles} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ className = '', children }: SimpleProps) {
  return (
    <div className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = '', children }: SimpleProps) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}

function CardContent({ className = '', children }: SimpleProps) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

function CardTitle({ className = '', children }: SimpleProps) {
  return <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

type BadgeProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function Badge({ className = '', children, onClick }: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer ${className}`}
    >
      {children}
    </span>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

