export function createPageUrl(pageName: string) {
  const map: Record<string, string> = {
    Home: "/",
    Events: "/events",
    Community: "/community",
    Tokens: "/tokens",
    Profile: "/profile",
    Login: "/login",
    Register: "/register",
    AdminUsers: "/admin/users",
  };
  return map[pageName] ?? "/";
}

