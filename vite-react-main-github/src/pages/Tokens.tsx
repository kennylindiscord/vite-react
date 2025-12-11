// src/pages/Tokens.tsx
import React, { useEffect, useState } from 'react';
import {
  Award,
  TrendingUp,
  Calendar as CalendarIcon,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { format } from 'date-fns';

const DEMO_USER_EMAIL = 'demo.resident@example.com';

const FALLBACK_TRANSACTIONS = [
  {
    id: '1',
    user_email: DEMO_USER_EMAIL,
    amount: 150,
    type: 'event_attendance',
    description: 'Neighborhood Clean-up',
    created_date: '2025-12-20T12:00:00Z',
  },
  {
    id: '2',
    user_email: DEMO_USER_EMAIL,
    amount: 100,
    type: 'event_attendance',
    description: 'Teen Coding Night',
    created_date: '2025-12-22T20:00:00Z',
  },
  {
    id: '3',
    user_email: DEMO_USER_EMAIL,
    amount: -80,
    type: 'reward_redemption',
    description: 'Discount at local café',
    created_date: '2025-12-23T10:30:00Z',
  },
];

type Transaction = (typeof FALLBACK_TRANSACTIONS)[number];

const typeIcons: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  event_attendance: { icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
  post_creation: { icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  volunteer: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  reward_redemption: { icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
  admin_adjustment: { icon: Award, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function Tokens() {
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoadError(null);
        const res = await fetch(
          `/api/tokens/transactions?userEmail=${encodeURIComponent(DEMO_USER_EMAIL)}`,
        );
        if (!res.ok) {
          throw new Error('Failed to load token transactions');
        }
        const data = (await res.json()) as Transaction[];
        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
        }
      } catch (err) {
        console.error(err);
        setLoadError('Could not load tokens from the server. Showing demo data instead.');
      }
    };

    loadTransactions();
  }, []);

  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(
    transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
  );

  const currentBalance = totalEarned - totalSpent;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Tokens</h1>
        <p className="text-lg text-gray-600">Earned through community participation</p>
        {loadError && (
          <p className="mt-2 text-sm text-red-600">{loadError}</p>
        )}
      </div>

      {/* Balance Card */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-center text-gray-700">Current Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Award className="h-12 w-12 text-amber-600" />
            <span className="text-6xl font-bold text-amber-600">{currentBalance}</span>
          </div>
          <p className="text-gray-600">Community Tokens</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">Total Earned</CardTitle>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totalEarned}</p>
            <p className="text-sm text-gray-600 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-700">Total Redeemed</CardTitle>
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{totalSpent}</p>
            <p className="text-sm text-gray-600 mt-1">All time redemptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const typeConfig = typeIcons[transaction.type] || typeIcons.admin_adjustment;
              const Icon = typeConfig.icon;
              const isEarning = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-full ${typeConfig.bg} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.description ||
                          transaction.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(transaction.created_date),
                          'MMM d, yyyy • h:mm a',
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        isEarning ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isEarning ? '+' : ''}
                      {transaction.amount}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {transaction.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">
                  Participate in events to start earning tokens!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle>How to Earn Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EarnRow
              icon={CalendarIcon}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              title="Attend Events"
              text="Join community events and activities"
            />
            <EarnRow
              icon={Users}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              title="Create Posts"
              text="Share updates and engage with neighbors"
            />
            <EarnRow
              icon={TrendingUp}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              title="Volunteer"
              text="Help out in community projects"
            />
            <EarnRow
              icon={Award}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              title="Special Rewards"
              text="Earn bonus tokens for achievements"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Small helpers */

type SimpleProps = {
  className?: string;
  children: React.ReactNode;
};

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
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
};

function Badge({ className = '', variant = 'solid', children }: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border';
  const styles =
    variant === 'outline'
      ? 'border-gray-300 text-gray-700 bg-white'
      : 'border-transparent bg-gray-200 text-gray-800';
  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}

type EarnRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  text: string;
};

function EarnRow({ icon: Icon, iconBg, iconColor, title, text }: EarnRowProps) {
  return (
    <div className="flex items-start space-x-3">
      <div
        className={`h-8 w-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

