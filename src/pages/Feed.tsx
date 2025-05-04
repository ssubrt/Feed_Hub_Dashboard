
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import FeedItem from '@/components/FeedItem';
import { FeedItem as FeedItemType } from '@/types';
import { fetchFeed } from '@/services/feedService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/sonner';
import { Twitter, LayoutGrid } from 'lucide-react';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<Array<"twitter" | "reddit">>(['twitter', 'reddit']);
  
  useEffect(() => {
    const loadFeed = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const feed = await fetchFeed(selectedSources);
        setFeedItems(feed);
      } catch (error) {
        console.error("Error loading feed:", error);
        toast.error("Failed to load the content feed");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeed();
  }, [user, selectedSources]);
  
  const handleSourceToggle = (source: "twitter" | "reddit") => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        // Don't allow deselecting all sources
        if (prev.length === 1) {
          toast.error("At least one source must be selected");
          return prev;
        }
        return prev.filter(s => s !== source);
      } else {
        return [...prev, source];
      }
    });
  };
  
  const handleSaveToggle = (postId: string, saved: boolean) => {
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.id === postId ? { ...item, saved } : item
      )
    );
  };
  
  const filteredFeed = feedItems.filter(item => {
    // Apply search filter if query exists
    if (searchQuery) {
      return (
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  }).filter(item => {
    // Filter by tab
    if (activeTab === 'saved') {
      return item.saved;
    }
    return true;
  });

  return (
    <Layout requireAuth>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
        <p className="text-gray-600">
          Stay updated with the latest content for creators from Twitter and Reddit.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/2">
              <Input 
                placeholder="Search content..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="twitter" 
                  checked={selectedSources.includes('twitter')} 
                  onCheckedChange={() => handleSourceToggle('twitter')}
                />
                <Label htmlFor="twitter" className="flex items-center cursor-pointer">
                  <Twitter className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Twitter</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reddit" 
                  checked={selectedSources.includes('reddit')} 
                  onCheckedChange={() => handleSourceToggle('reddit')}
                />
                <Label htmlFor="reddit" className="flex items-center cursor-pointer">
                  <LayoutGrid className="h-4 w-4 mr-1 text-orange-500" />
                  <span>Reddit</span>
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'all' | 'saved')}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 w-[200px]">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="saved">Saved Only</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-creator-purple"></div>
        </div>
      ) : filteredFeed.length > 0 ? (
        <div className="space-y-6">
          {filteredFeed.map((item) => (
            <FeedItem 
              key={item.id} 
              item={item} 
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'saved' 
              ? "You haven't saved any content yet. Browse the feed and save content you like."
              : "There's no content matching your current filters. Try adjusting your search or source filters."}
          </p>
          {activeTab === 'saved' && (
            <Button onClick={() => setActiveTab('all')}>
              Browse All Content
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Feed;
