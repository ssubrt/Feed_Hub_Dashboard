
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Share, Flag, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { FeedItem as FeedItemType } from "@/types";
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toggleSavePost, reportPost } from '@/services/feedService';
import { useAuth } from '@/contexts/AuthContext';
import { awardCredits } from '@/services/creditService';

interface Props {
  item: FeedItemType;
  onSaveToggle: (postId: string, saved: boolean) => void;
}

const FeedItemComponent: React.FC<Props> = ({ item, onSaveToggle }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(item.saved || false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const handleSaveToggle = async () => {
    if (!user) return;
    
    try {
      const isSaved = await toggleSavePost(user.id, item.id);
      setSaved(isSaved);
      onSaveToggle(item.id, isSaved);
      
      if (isSaved) {
        // Award credits for saving content
        await awardCredits(user.id, 2, "Saved content");
        toast.success("Post saved and earned 2 credits!");
      } else {
        toast.info("Post removed from saves");
      }
    } catch (error) {
      toast.error("Could not save post");
    }
  };
  
  const handleShare = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(item.url)
      .then(() => {
        toast.success("Link copied to clipboard!");
        
        // Award credits for sharing
        if (user) {
          awardCredits(user.id, 5, "Shared content")
            .then(() => {
              toast.success("Earned 5 credits for sharing!");
            });
        }
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };
  
  const handleReport = async () => {
    if (!user || !reportReason.trim()) return;
    
    setIsReporting(true);
    
    try {
      await reportPost(user.id, item.id, reportReason);
      setIsReportDialogOpen(false);
      toast.success("Thank you for your report. Our team will review it.");
      
      // Award credits for reporting inappropriate content
      await awardCredits(user.id, 1, "Reported inappropriate content");
      toast.success("Earned 1 credit for reporting!");
    } catch (error) {
      toast.error("Could not submit your report");
    } finally {
      setIsReporting(false);
      setReportReason('');
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div>
            <span className="text-creator-purple">@{item.author}</span>
            <div className="text-sm font-normal text-gray-500 mt-1">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              {' · '}
              <span className="capitalize">{item.source}</span>
            </div>
          </div>
          <div className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full">
            {item.source === 'twitter' ? 'Twitter' : 'Reddit'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 mb-4">{item.content}</p>
        {item.imageUrl && (
          <div className="relative h-48 mb-2 overflow-hidden rounded-md bg-gray-100">
            <img 
              src={item.imageUrl} 
              alt="Post content" 
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={handleSaveToggle}>
          {saved ? (
            <>
              <BookmarkCheck className="h-5 w-5 mr-1 text-creator-purple" />
              <span className="text-creator-purple">Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-5 w-5 mr-1" />
              <span>Save</span>
            </>
          )}
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="h-5 w-5 mr-1" />
          <span>Share</span>
        </Button>
        
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Flag className="h-5 w-5 mr-1" />
              <span>Report</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Inappropriate Content</DialogTitle>
            </DialogHeader>
            <div className="my-4">
              <p className="text-sm text-gray-500 mb-4">
                Please let us know why you're reporting this content. This will help our moderators review it faster.
              </p>
              <Textarea
                placeholder="Why is this content inappropriate?"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsReportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReport} 
                disabled={isReporting || !reportReason.trim()}
              >
                {isReporting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default FeedItemComponent;
