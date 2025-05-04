
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '@/components/StatCard';
import { adjustUserCredits, getAllUsers } from '@/services/creditService';
import { getReportedPosts } from '@/services/feedService';
import { User, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { User as UserType, FeedItem } from '@/types';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [reportedPosts, setReportedPosts] = useState<Array<{post: FeedItem, reason: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newCreditAmount, setNewCreditAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all users
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        
        // Fetch reported posts
        const reported = await getReportedPosts();
        setReportedPosts(reported);
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdminData();
  }, []);
  
  const handleAdjustCredits = (user: UserType) => {
    setSelectedUser(user);
    setNewCreditAmount(user.credits);
    setIsDialogOpen(true);
  };
  
  const handleCreditsSubmit = async () => {
    if (!selectedUser) return;
    
    try {
      await adjustUserCredits(selectedUser.id, newCreditAmount);
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, credits: newCreditAmount } : user
      ));
      
      toast.success(`Credits for ${selectedUser.username} updated successfully`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adjusting credits:", error);
      toast.error("Failed to adjust user credits");
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    return (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Admin statistics
  const totalUsers = users.length;
  const newUsersToday = users.filter(user => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(user.createdAt).getTime() >= today.getTime();
  }).length;
  const totalCreditsIssued = users.reduce((sum, user) => sum + user.credits, 0);

  return (
    <Layout requireAuth adminOnly>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, credits, and content
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-creator-purple"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<Users className="h-6 w-6 text-creator-purple" />}
            />
            <StatCard
              title="New Users Today"
              value={newUsersToday}
              icon={<User className="h-6 w-6 text-green-600" />}
              trend="up"
            />
            <StatCard
              title="Total Credits Issued"
              value={totalCreditsIssued}
              icon={<TrendingUp className="h-6 w-6 text-creator-purple" />}
            />
            <StatCard
              title="Reported Content"
              value={reportedPosts.length}
              icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
            />
          </div>
          
          <Tabs 
            defaultValue="users" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="content">Content Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all users of the platform
                  </CardDescription>
                  <div className="mt-4">
                    <Input 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <span className={`${
                                user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              } px-2 py-1 rounded-full text-xs font-medium`}>
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>{user.credits}</TableCell>
                            <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{format(new Date(user.lastLoginAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAdjustCredits(user)}
                              >
                                Adjust Credits
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No users found matching your search</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Content</CardTitle>
                  <CardDescription>
                    Review and moderate content reported by users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportedPosts.length > 0 ? (
                    <div className="space-y-6">
                      {reportedPosts.map(({ post, reason }) => (
                        <div key={post.id} className="border rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">
                                Content from {post.source} by @{post.author}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {format(new Date(post.createdAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <span className="text-red-600 text-sm font-medium">Reported</span>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-gray-800">{post.content}</p>
                          </div>
                          
                          <div className="mt-4 bg-red-50 p-3 rounded">
                            <p className="text-sm font-medium text-red-700">Report Reason:</p>
                            <p className="text-sm text-red-600">{reason}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-end space-x-3">
                            <Button variant="outline" size="sm">Dismiss Report</Button>
                            <Button variant="destructive" size="sm">Remove Content</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reported content to review</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Adjust Credits Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust User Credits</DialogTitle>
                <DialogDescription>
                  Update the credit balance for {selectedUser?.username}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Credits: {selectedUser?.credits}</label>
                  <Input
                    type="number"
                    value={newCreditAmount}
                    onChange={(e) => setNewCreditAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreditsSubmit}>
                  Update Credits
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Layout>
  );
};

export default Admin;
