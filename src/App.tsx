import React, { useState } from 'react';
import { Home, Info } from 'react';

// Define the available page types
type PageType = 'home' | 'about';

// --- Page Components ---

const HomePage: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome Home</h2>
    <p className="text-xl text-gray-600 dark:text-gray-400">
      This is the main landing page of our application. We focus on providing fast, reliable, and scalable solutions for modern web development, much like Vercel itself!
    </p>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard title="Instant Deployment" description="Push to Git and your site is live globally in seconds." />
      <FeatureCard title="Global Edge Network" description="Content is served from the closest location for maximum speed." />
      <FeatureCard title="Serverless Functions" description="Run backend code on demand without managing servers." />
    </div>
  </div>
);

const AboutPage: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Our Mission</h2>
    <p className="text-xl text-gray-600 dark:text-gray-400">
      We believe in a simpler, more effective way to build the web. Our mission is to abstract away the infrastructure complexity so developers can focus solely on building great user experiences.
    </p>
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Core Values</h3>
      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-center"><span className="text-blue-500 mr-2">→</span> Speed and Performance</li>
        <li className="flex items-center"><span className="text-blue-500 mr-2">→</span> Developer Experience</li>
        <li className="flex items-center"><span className="text-blue-500 mr-2">→</span> Continuous Innovation</li>
      </ul>
    </div>
  </div>
);

// --- Shared Components ---

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 transition-all hover:shadow-lg hover:scale-[1.02]">
    <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{title}</h4>
    <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick, Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center px-4 py-2 rounded-lg transition-all duration-200
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }
    `}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span className="font-medium hidden sm:inline">{label}</span>
  </button>
);

// --- Main Application Component ---

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Determine which page content to render
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 shadow-md backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          
          {/* Logo/Title */}
          <div className="flex items-center">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">CommunityServer</span>
          </div>

          {/* Navigation (Top Right Corner) */}
          <nav className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <NavButton
              label="Home"
              Icon={Home}
              isActive={currentPage === 'home'}
              onClick={() => setCurrentPage('home')}
            />
            <NavButton
              label="About Us"
              Icon={Info}
              isActive={currentPage === 'about'}
              onClick={() => setCurrentPage('about')}
            />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl min-h-[60vh]">
          {renderContent()}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-500">
        &copy; 2024 CommunityServer App. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
