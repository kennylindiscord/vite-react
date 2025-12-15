// src/pages/Events.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Award, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const DEMO_USER_EMAIL = 'demo.resident@example.com';

const FALLBACK_EVENTS = [
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

type Event = (typeof FALLBACK_EVENTS)[number];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Events',
  town_hall: 'Town Hall',
  cleanup: 'Cleanup',
  workshop: 'Workshop',
  festival: 'Festival',
};

const categoryColors: Record<string, string> = {
  town_hall: 'bg-blue-100 text-blue-800',
  cleanup: 'bg-green-100 text-green-800',
  workshop: 'bg-purple-100 text-purple-800',
  festival: 'bg-pink-100 text-pink-800',
  sports: 'bg-orange-100 text-orange-800',
  education: 'bg-indigo-100 text-indigo-800',
  health: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [events, setEvents] = useState<Event[]>(FALLBACK_EVENTS);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch('/api/events');
        if (!res.ok) {
          throw new Error('Failed to load events');
        }
        const data = (await res.json()) as Event[];
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.error(err);
        setLoadError('Could not load events from the server. Showing demo data instead.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const isRegistered = (eventId: string) => registrations.includes(eventId);

  const handleRegister = async (eventId: string) => {
    if (isRegistered(eventId)) return;

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: DEMO_USER_EMAIL }),
      });

      if (!res.ok) {
        throw new Error('Failed to register');
      }

      setRegistrations((prev) => [...prev, eventId]);
      alert('Successfully registered for the event! (+tokens in real system)');
    } catch (err) {
      console.error(err);
      alert('Could not register for this event. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Events</h1>
        <p className="text-lg text-gray-600">
          Join events and earn tokens while making our community better
        </p>
        {loadError && (
          <p className="mt-2 text-sm text-red-600">{loadError}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-white border border-gray-200 p-1">
          {['all', 'town_hall', 'cleanup', 'workshop', 'festival'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedCategory(value)}
              className={`px-3 py-1 text-sm rounded-full mx-1 ${
                selectedCategory === value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {CATEGORY_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading events...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const registered = isRegistered(event.id);
              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-green-400 relative">
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>+{event.tokens_reward}</span>
                    </div>
                    {event.status === 'completed' && (
                      <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={categoryColors[event.category] || categoryColors.other}>
                        {event.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 line-clamp-2">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        {format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          {event.location}
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-purple-600" />
                          Max {event.capacity} participants
                        </div>
                      )}
                    </div>

                    {registered ? (
                      <Button disabled className="w-full" variant="secondary">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRegister(event.id)}
                        disabled={event.status !== 'upcoming'}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
              <p className="text-gray-500">Check back later for upcoming community events.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* Minimal UI helpers (same as before) */

type SimpleProps = {
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

function Button({ className = '', variant = 'primary', children, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const styles =
    variant === 'secondary'
      ? 'bg-gray-100 text-gray-700 cursor-default'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
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

function Badge({ className = '', children }: SimpleProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

