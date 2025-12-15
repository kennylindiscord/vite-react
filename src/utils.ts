export type PageName = 'Home' | 'Events' | 'Community' | 'Tokens' | 'Profile';

const PAGE_ROUTES: Record<PageName, string> = {
  Home: '/',
  Events: '/events',
  Community: '/community',
  Tokens: '/tokens',
  Profile: '/profile',
};

export function createPageUrl(pageName: PageName): string {
  return PAGE_ROUTES[pageName] ?? '/';
}

export function getPageTitle(pageName: PageName): string {
  const titles: Record<PageName, string> = {
    Home: 'County Community – Home',
    Events: 'County Community – Events',
    Community: 'County Community – Community Board',
    Tokens: 'County Community – Tokens',
    Profile: 'County Community – My Profile',
  };

  return titles[pageName];
}
