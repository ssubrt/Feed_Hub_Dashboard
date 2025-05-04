
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Bookmark, User as UserIcon, AlertTriangle, Activity } from 'lucide-react';
import { DashboardStats, FeedItem, CreditTransaction } from '@/types';
import { getUserDashboardStats } from '@/services/creditService';
import { getSavedPosts } from '@/services/feedService';
import { useAuth } from '@/contexts/AuthContext';
import { awardCredits, getCreditTransactions } from '@/services/creditService';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [savedPosts, setSavedPosts] = useState<FeedItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLoginClaimed, setDailyLoginClaimed] = useState(false);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Check localStorage to see if daily login was already claimed today
        const lastClaimed = localStorage.getItem('lastDailyLoginClaim');
        const today = new Date().toDateString();
        
        if (lastClaimed !== today) {
          setDailyLoginClaimed(false);
        } else {
          setDailyLoginClaimed(true);
        }
        
        // Fetch dashboard stats
        const dashboardStats = await getUserDashboardStats(user.id);
        setStats(dashboardStats);
        
        // Fetch saved posts
        const posts = await getSavedPosts(user.id);
        setSavedPosts(posts);
        
        // Fetch recent credit transactions
        const transactions = await getCreditTransactions(user.id);
        setRecentTransactions(transactions.slice(0, 5)); // Show only the 5 most recent transactions
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  const handleClaimDailyLogin = async () => {
    if (!user || dailyLoginClaimed) return;
    
    try {
      // Award credits for daily login
      await awardCredits(user.id, 10, "Daily login bonus");
      
      // Update localStorage to mark today as claimed
      localStorage.setItem('lastDailyLoginClaim', new Date().toDateString());
      setDailyLoginClaimed(true);
      
      // Refresh stats and transactions
      const updatedStats = await getUserDashboardStats(user.id);
      setStats(updatedStats);
      
      const transactions = await getCreditTransactions(user.id);
      setRecentTransactions(transactions.slice(0, 5));
      
      toast.success("You claimed 10 credits for your daily login!");
    } catch (error) {
      console.error("Error claiming daily login bonus:", error);
      toast.error("Failed to claim daily login bonus");
    }
  };
  
  if (isLoading) {
    return (
      <Layout requireAuth>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-creator-purple"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome Back, {user?.username}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your activity.</p>
      </div>
      
      {/* Daily Login Bonus Card */}
      <Card className="mb-8 border-creator-purple border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Daily Login Bonus</h3>
              <p className="text-gray-600">Claim your 10 credits for logging in today!</p>
            </div>
            <Button 
              onClick={handleClaimDailyLogin}
              disabled={dailyLoginClaimed}
              className="mt-4 md:mt-0 bg-creator-purple hover:bg-creator-darkPurple"
            >
              {dailyLoginClaimed ? 'Already Claimed Today' : 'Claim 10 Credits'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Credits"
          value={stats?.totalCredits || 0}
          icon={<CreditCard className="h-6 w-6 text-creator-purple" />}
        />
        <StatCard
          title="Credits Earned Today"
          value={stats?.creditsEarnedToday || 0}
          icon={<TrendingUp className="h-6 w-6 text-creator-purple" />}
          trend="up"
          trendValue="+10 from yesterday"
        />
        <StatCard
          title="Saved Posts"
          value={stats?.savedPosts || 0}
          icon={<Bookmark className="h-6 w-6 text-creator-purple" />}
        />
        <StatCard
          title="Profile Completion"
          value={`${stats?.profileCompletion || 0}%`}
          icon={<UserIcon className="h-6 w-6 text-creator-purple" />}
        />
      </div>
      
      {/* Profile Completion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Finish setting up your profile to earn more credits and unlock new features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{stats?.profileCompletion}%</span>
              </div>
              <Progress value={stats?.profileCompletion} className="h-2" />
            </div>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="w-full"
            >
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Credit Activities</CardTitle>
            <CardDescription>
              Your recent credit transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <ul className="space-y-4">
                {recentTransactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{tx.reason}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-6">No recent credit activities</p>
            )}
          </CardContent>
        </Card>
        
        {/* Saved Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Content</CardTitle>
            <CardDescription>
              Posts you've saved for later
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedPosts.length > 0 ? (
              <ul className="space-y-4">
                {savedPosts.map((post) => (
                  <li key={post.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">{post.source}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2">{post.content}</p>
                  </li>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => navigate('/feed')}
                >
                  View All Saved Content
                </Button>
              </ul>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">You haven't saved any content yet</p>
                <Button onClick={() => navigate('/feed')}>
                  Browse Content Feed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
