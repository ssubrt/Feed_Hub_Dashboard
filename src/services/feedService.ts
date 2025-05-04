
import { FeedItem } from '@/types';

// Mock data for feed
const mockTwitterFeed: FeedItem[] = [
  {
    id: "t1",
    source: "twitter",
    sourceId: "12345",
    content: "Just launched a new creator dashboard! Check out the amazing features for content creators.",
    author: "TechLauncher",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop",
    url: "https://twitter.com/example/status/12345"
  },
  {
    id: "t2",
    source: "twitter",
    sourceId: "12346",
    content: "How creators can maximize their revenue in 2025: A thread 🧵",
    author: "CreatorEconomy",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    url: "https://twitter.com/example/status/12346"
  },
  {
    id: "t3",
    source: "twitter",
    sourceId: "12347",
    content: "Our latest update includes new analytic tools for creators to understand their audience better.",
    author: "ProductUpdates",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop",
    url: "https://twitter.com/example/status/12347"
  },
  {
    id: "t4",
    source: "twitter",
    sourceId: "12348",
    content: "Just hit 100k followers! Thanks to all my supporters for the amazing journey so far!",
    author: "TopCreator",
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    url: "https://twitter.com/example/status/12348"
  },
];

const mockRedditFeed: FeedItem[] = [
  {
    id: "r1",
    source: "reddit",
    sourceId: "abc123",
    content: "What tools do you use for tracking your creator analytics? I'm looking for recommendations.",
    author: "creator_curious",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    url: "https://reddit.com/r/Creators/comments/abc123"
  },
  {
    id: "r2",
    source: "reddit",
    sourceId: "abc124",
    content: "I built a dashboard that helps creators track their income across multiple platforms. Here's how it works.",
    author: "dev_for_creators",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop",
    url: "https://reddit.com/r/Creators/comments/abc124"
  },
  {
    id: "r3",
    source: "reddit",
    sourceId: "abc125",
    content: "How much time do you spend on content creation vs. business management as a creator?",
    author: "time_management_guru",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    url: "https://reddit.com/r/Creators/comments/abc125"
  },
  {
    id: "r4",
    source: "reddit",
    sourceId: "abc126",
    content: "Launched my creator membership program today and already got 50 subscribers! Here's how I promoted it.",
    author: "successful_creator",
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
    url: "https://reddit.com/r/Creators/comments/abc126"
  },
];

// Function to fetch feed items
export const fetchFeed = async (sources: Array<"twitter" | "reddit"> = ["twitter", "reddit"]): Promise<FeedItem[]> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1000));
  
  let combinedFeed: FeedItem[] = [];
  
  if (sources.includes("twitter")) {
    combinedFeed = [...combinedFeed, ...mockTwitterFeed];
  }
  
  if (sources.includes("reddit")) {
    combinedFeed = [...combinedFeed, ...mockRedditFeed];
  }
  
  // Sort by date (newest first)
  return combinedFeed.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Mock saved posts storage
let mockSavedPosts: Record<string, boolean> = {};

// Function to save/unsave a post
export const toggleSavePost = async (userId: string, postId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 300));
  
  const key = `${userId}-${postId}`;
  
  if (mockSavedPosts[key]) {
    delete mockSavedPosts[key];
    return false;
  } else {
    mockSavedPosts[key] = true;
    return true;
  }
};

// Function to check if a post is saved
export const isPostSaved = (userId: string, postId: string): boolean => {
  return !!mockSavedPosts[`${userId}-${postId}`];
};

// Function to get saved posts for a user
export const getSavedPosts = async (userId: string): Promise<FeedItem[]> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 800));
  
  const allPosts = [...mockTwitterFeed, ...mockRedditFeed];
  
  return allPosts.filter(post => isPostSaved(userId, post.id));
};

// Mock reported posts storage
let mockReportedPosts: Record<string, string> = {};

// Function to report a post
export const reportPost = async (userId: string, postId: string, reason: string): Promise<void> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 300));
  
  mockReportedPosts[`${userId}-${postId}`] = reason;
};

// Admin function to get reported posts
export const getReportedPosts = async (): Promise<Array<{post: FeedItem, reason: string}>> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 800));
  
  const allPosts = [...mockTwitterFeed, ...mockRedditFeed];
  const reportedPostsResult: Array<{post: FeedItem, reason: string}> = [];
  
  for (const key in mockReportedPosts) {
    const [userId, postId] = key.split('-');
    const post = allPosts.find(p => p.id === postId);
    
    if (post) {
      reportedPostsResult.push({
        post,
        reason: mockReportedPosts[key]
      });
    }
  }
  
  return reportedPostsResult;
};
