export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  about: "/about",
  pricing: "/pricing",
  dashboardFeed: "/dashboard/feed",
  dashboardCreate: "/dashboard/create",
  dashboardMessages: "/dashboard/messages",
  dashboardProfile: "/dashboard/profile",
} as const;

export function dashboardProfilePath(userId: string) {
  return `${ROUTES.dashboardProfile}/${userId}`;
}
