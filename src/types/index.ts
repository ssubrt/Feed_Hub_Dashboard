
// User related types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Not returned from API
  role: UserRole;
  credits: number;
  profileCompleted: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Credit system related types
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: string;
}

// Feed related types
export interface FeedSource {
  id: string;
  name: "twitter" | "reddit";
  enabled: boolean;
}

export interface FeedItem {
  id: string;
  source: "twitter" | "reddit";
  sourceId: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
  url: string;
  saved?: boolean;
  reported?: boolean;
}

export interface UserFeedPreference {
  userId: string;
  sources: FeedSource[];
}

// Dashboard related types
export interface DashboardStats {
  totalCredits: number;
  creditsEarnedToday: number;
  savedPosts: number;
  profileCompletion: number;
}

// Admin related types
export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalCreditsIssued: number;
  reportedPosts: number;
}
