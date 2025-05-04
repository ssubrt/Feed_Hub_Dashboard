
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { awardCredits } from '@/services/creditService';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: '',
    website: '',
    twitter: '',
    location: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    creditUpdates: true,
    newContent: false,
    platformUpdates: true
  });
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would update the user profile here
      // For the demo, we'll just show a success message and award credits
      if (user) {
        // Award credits if this is the first time completing profile
        await awardCredits(user.id, 15, "Completed profile");
      }
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would update the password here
      toast.success("Password updated successfully!");
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would update notification settings here
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update notification preferences");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout requireAuth>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">
          Manage your profile settings and preferences
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Password</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and public details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-creator-purple text-white flex items-center justify-center text-4xl">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                    >
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="md:w-3/4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={user?.username || ''} 
                          disabled 
                        />
                        <p className="text-xs text-gray-500">Your unique username cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user?.email || ''} 
                          disabled 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={profileForm.fullName}
                        onChange={e => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        placeholder="Tell us a bit about yourself"
                        value={profileForm.bio}
                        onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        placeholder="https://yourwebsite.com"
                        value={profileForm.website}
                        onChange={e => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          placeholder="@yourhandle"
                          value={profileForm.twitter}
                          onChange={e => setProfileForm(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          placeholder="City, Country"
                          value={profileForm.location}
                          onChange={e => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-creator-purple hover:bg-creator-darkPurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-creator-purple hover:bg-creator-darkPurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificationsSubmit}>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email} 
                      onCheckedChange={checked => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Credit Updates</p>
                      <p className="text-sm text-gray-500">Get notified about changes to your credit balance</p>
                    </div>
                    <Switch 
                      checked={notifications.creditUpdates} 
                      onCheckedChange={checked => setNotifications(prev => ({ ...prev, creditUpdates: checked }))}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">New Content</p>
                      <p className="text-sm text-gray-500">Be notified when new content is available in your feed</p>
                    </div>
                    <Switch 
                      checked={notifications.newContent} 
                      onCheckedChange={checked => setNotifications(prev => ({ ...prev, newContent: checked }))}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Platform Updates</p>
                      <p className="text-sm text-gray-500">Receive updates about new features and improvements</p>
                    </div>
                    <Switch 
                      checked={notifications.platformUpdates} 
                      onCheckedChange={checked => setNotifications(prev => ({ ...prev, platformUpdates: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-creator-purple hover:bg-creator-darkPurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Profile;
