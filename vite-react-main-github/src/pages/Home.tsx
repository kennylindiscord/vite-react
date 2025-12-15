// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Calendar,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

type Event = {
  id: string;
  title: string;
  event_date: string;
  image_url: string;
  tokens_reward: number;
  status: EventStatus;
};

type Post = {
  id: string;
  category: string;
  created_date: string;
  title: string;
  content: string;
  author_name?: string;
};

const MOCK_UPCOMING_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neighborhood Clean-up',
    event_date: '2025-12-20T10:00:00Z',
    image_url: '',
    tokens_reward: 150,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Teen Coding Night',
    event_date: '2025-12-22T18:00:00Z',
    image_url: '',
    tokens_reward: 100,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Community Town Hall',
    event_date: '2025-12-25T19:00:00Z',
    image_url: '',
    tokens_reward: 120,
    status: 'upcoming',
  },
];

const MOCK_RECENT_POSTS: Post[] = [
  {
    id: '1',
    category: 'news',
    created_date: '2025-12-05T09:00:00Z',
    title: 'New Community Garden Opening',
    content:
      'We are excited to announce a new community garden in the Riverside neighborhood...',
    author_name: 'Community Member',
  },
  {
    id: '2',
    category: 'discussion',
    created_date: '2025-12-03T14:30:00Z',
    title: 'Ideas for Youth Programs',
    content:
      'What kind of activities would you like to see for teens next spring?',
    author_name: 'Alex P.',
  },
  {
    id: '3',
    category: 'announcement',
    created_date: '2025-12-01T11:15:00Z',
    title: 'Holiday Schedule Updates',
    content: 'Here is the updated holiday schedule for county services...',
    author_name: 'County Staff',
  },
];

export default function Home() {
  const upcomingEvents = MOCK_UPCOMING_EVENTS;
  const recentPosts = MOCK_RECENT_POSTS;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-32 -translate-x-32" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-blue-100 font-medium">
              Welcome to Your Community
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Building Stronger Neighborhoods Together
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect with your neighbors, participate in local events, and earn
            rewards for making our community better.
          </p>
          <Button
            onClick={() =>
              alert('TODO: connect this button to your login or signup flow')
            }
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Join Our Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">
                Active Events
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {upcomingEvents.length}+
            </p>
            <p className="text-sm text-gray-600 mt-1">Happening this month</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">
                Community Members
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">500+</p>
            <p className="text-sm text-gray-600 mt-1">And growing</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">
                Tokens Earned
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">10,000+</p>
            <p className="text-sm text-gray-600 mt-1">By our community</p>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to={createPageUrl('Events')}>
            <Button variant="ghost" className="text-blue-600">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 to-green-400 relative">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  +{event.tokens_reward} tokens
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(
                    new Date(event.event_date),
                    'MMM d, yyyy • h:mm a',
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Link to={createPageUrl('Events')}>
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming events yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Community Highlights */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Community Highlights
          </h2>
          <Link to={createPageUrl('Community')}>
            <Button variant="ghost" className="text-blue-600">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(post.created_date), 'MMM d')}
                  </span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>By {post.author_name || 'Community Member'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {recentPosts.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* Minimal UI helpers for this page */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost';
};

function Button({
  className = '',
  variant = 'solid',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const styles =
    variant === 'ghost'
      ? 'bg-transparent text-blue-600 hover:bg-blue-50'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

type SimpleProps = {
  className?: string;
  children: React.ReactNode;
};

function Card({ className = '', children }: SimpleProps) {
  return (
    <div
      className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
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

