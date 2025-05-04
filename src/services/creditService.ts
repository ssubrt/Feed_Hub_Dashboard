
import { CreditTransaction, DashboardStats, User } from '@/types';

// Mock credit transactions
let mockTransactions: CreditTransaction[] = [
  {
    id: "ct1",
    userId: "user-1",
    amount: 10,
    reason: "Daily login",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "ct2",
    userId: "user-1",
    amount: 5,
    reason: "Shared post",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "ct3",
    userId: "user-1",
    amount: 15,
    reason: "Completed profile",
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  }
];

// Mock user credits (we would normally store this in the user record)
const mockUserCredits: Record<string, number> = {
  "user-1": 100,
  "admin-1": 500
};

// Function to award credits to a user
export const awardCredits = async (userId: string, amount: number, reason: string): Promise<number> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 300));
  
  // Create transaction record
  const transaction: CreditTransaction = {
    id: `ct${Math.floor(Math.random() * 10000)}`,
    userId,
    amount,
    reason,
    createdAt: new Date().toISOString()
  };
  
  mockTransactions.push(transaction);
  
  // Update user's credit balance
  mockUserCredits[userId] = (mockUserCredits[userId] || 0) + amount;
  
  // If user data is stored in localStorage, update it
  try {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.id === userId) {
        user.credits = mockUserCredits[userId];
        localStorage.setItem('authUser', JSON.stringify(user));
      }
    }
  } catch (error) {
    console.error("Error updating stored user credits:", error);
  }
  
  return mockUserCredits[userId];
};

// Function to get a user's credit balance
export const getCredits = async (userId: string): Promise<number> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 200));
  
  return mockUserCredits[userId] || 0;
};

// Function to get a user's credit transactions
export const getCreditTransactions = async (userId: string): Promise<CreditTransaction[]> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 600));
  
  return mockTransactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Function to get user dashboard stats
export const getUserDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 800));
  
  // Get today's date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter transactions for today
  const todayTransactions = mockTransactions.filter(tx => {
    const txDate = new Date(tx.createdAt);
    txDate.setHours(0, 0, 0, 0);
    return tx.userId === userId && txDate.getTime() === today.getTime();
  });
  
  // Calculate credits earned today
  const creditsEarnedToday = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Count saved posts (we'll use our feedService function in real code)
  const savedPosts = Math.floor(Math.random() * 10); // Mock for now
  
  // Determine profile completion (would be based on user data)
  const profileCompletion = Math.floor(Math.random() * 50) + 50; // Mock between 50-100%
  
  return {
    totalCredits: mockUserCredits[userId] || 0,
    creditsEarnedToday,
    savedPosts,
    profileCompletion
  };
};

// ADMIN FUNCTIONS

// Function to get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1000));
  
  // Generate some mock users
  return [
    {
      id: "user-1",
      username: "regularuser",
      email: "user@example.com",
      role: "user",
      credits: mockUserCredits["user-1"] || 0,
      profileCompleted: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      lastLoginAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: "admin-1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      credits: mockUserCredits["admin-1"] || 0,
      profileCompleted: true,
      createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
      lastLoginAt: new Date(Date.now() - 1 * 3600000).toISOString()
    },
    {
      id: "user-2",
      username: "newcreator",
      email: "newcreator@example.com",
      role: "user",
      credits: 25,
      profileCompleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
      lastLoginAt: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: "user-3",
      username: "contentmaker",
      email: "contentmaker@example.com",
      role: "user",
      credits: 75,
      profileCompleted: true,
      createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
      lastLoginAt: new Date(Date.now() - 6 * 3600000).toISOString()
    }
  ];
};

// Function to adjust a user's credits (admin only)
export const adjustUserCredits = async (userId: string, newAmount: number): Promise<void> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 400));
  
  mockUserCredits[userId] = newAmount;
  
  // Record this as an admin adjustment
  mockTransactions.push({
    id: `ct${Math.floor(Math.random() * 10000)}`,
    userId,
    amount: newAmount - (mockUserCredits[userId] || 0),
    reason: "Admin adjustment",
    createdAt: new Date().toISOString()
  });
};
