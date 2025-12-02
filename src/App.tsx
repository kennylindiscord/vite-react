import React, { useState } from 'react';

// Define the available page types
type PageType = 'home' | 'about';

// --- Page Components ---

const HomePage: React.FC = () => (
  <div className="p-8 space-y-4">
    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome Home</h2>
    <p className="text-xl text-gray-600 dark:text-gray-400" style="text-align:center;">
      Welcome to <b>CommunityServer</b>, the webpage catered to your specific needs and curiosity within your surrounding environment! Here you will discover:
    </p>
    <div className="mt-8 grid col-span-1 md:grid-cols-3 gap-6">
      <FeatureCard title="Search" description="An interactive directory of community resources that allows users to search and filter the information. " />
      <FeatureCard title="Highlights" description="A section that spotlights at least three of the community resources you have listed in your resource hub." />
      <FeatureCard title="Recommendations" description="A form that users can submit to indicate new resources that should be added to the community resources hub." />
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
  // Changed Icon type to string for Emoji
  IconText: string; 
}

const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick, IconText }) => (
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
    {/* Rendering the emoji/text icon */}
    <span className="text-xl mr-2 leading-none">{IconText}</span> 
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
              IconText="🏠" // Using Home Emoji
              isActive={currentPage === 'home'}
              onClick={() => setCurrentPage('home')}
            />
            <NavButton
              label="About Us"
              IconText="ℹ️" // Using Info Emoji
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
