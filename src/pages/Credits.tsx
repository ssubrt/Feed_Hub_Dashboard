
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCreditTransactions, getCredits } from '@/services/creditService';
import { CreditTransaction } from '@/types';
import { format } from 'date-fns';
import StatCard from '@/components/StatCard';

const Credits: React.FC = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCreditData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch current credit balance
        const currentCredits = await getCredits(user.id);
        setCredits(currentCredits);
        
        // Fetch credit transactions
        const txs = await getCreditTransactions(user.id);
        setTransactions(txs);
      } catch (error) {
        console.error("Error loading credit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCreditData();
  }, [user]);
  
  // Calculate stats
  const totalEarned = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalSpent = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
  const lastTransaction = transactions.length > 0 ? 
    transactions[0].createdAt : 
    null;
  
  // Group transactions by date
  const groupedTransactions: Record<string, CreditTransaction[]> = {};
  
  transactions.forEach(tx => {
    const date = format(new Date(tx.createdAt), 'yyyy-MM-dd');
    
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    
    groupedTransactions[date].push(tx);
  });

  return (
    <Layout requireAuth>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Credit Management</h1>
        <p className="text-gray-600">
          Track your earned and spent credits
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-creator-purple"></div>
        </div>
      ) : (
        <>
          {/* Credit Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Current Balance"
              value={credits}
              icon={<CreditCard className="h-6 w-6 text-creator-purple" />}
            />
            <StatCard
              title="Total Earned"
              value={totalEarned}
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              trend="up"
            />
            <StatCard
              title="Total Spent"
              value={totalSpent}
              icon={<Clock className="h-6 w-6 text-red-500" />}
              trend="down"
            />
            <StatCard
              title="Last Transaction"
              value={lastTransaction ? format(new Date(lastTransaction), 'MMM d') : 'N/A'}
              icon={<Calendar className="h-6 w-6 text-creator-purple" />}
              description={lastTransaction ? format(new Date(lastTransaction), 'h:mm a') : ''}
            />
          </div>
          
          {/* Credit Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>
                Your complete credit transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedTransactions).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedTransactions)
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .map(([date, txs]) => (
                      <div key={date}>
                        <h3 className="font-medium text-gray-500 mb-4">
                          {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <div className="space-y-4">
                          {txs.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center border-b pb-4">
                              <div>
                                <p className="font-medium">{tx.reason}</p>
                                <p className="text-sm text-gray-500">{format(new Date(tx.createdAt), 'h:mm a')}</p>
                              </div>
                              <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No credit transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default Credits;
