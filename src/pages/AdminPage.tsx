
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UserData {
  id: string;
  email: string;
  balance: number;
  last_login?: string;
}

const AdminPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [amount, setAmount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // For simplicity, we're hardcoding admin check - in production, use RLS or a roles table
  const adminEmails = ['admin@example.com', 'your-email@example.com']; // Replace with actual admin emails

  useEffect(() => {
    // Check if current user is admin
    if (user) {
      const isAdminUser = adminEmails.includes(user.email || '');
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        toast.error('You do not have permission to access this page');
        navigate('/');
        return;
      }
      
      fetchUsers();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from auth.users (requires service role - should be done via an Edge Function in production)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Fetch balance information
      const { data: balances, error: balanceError } = await supabase
        .from('user_balances')
        .select('*');
        
      if (balanceError) {
        throw balanceError;
      }
      
      // Combine the data
      const combinedData = authUsers.users.map(authUser => {
        const userBalance = balances?.find(b => b.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || 'No email',
          balance: userBalance?.balance || 0,
          last_login: authUser.last_sign_in_at
        };
      });
      
      setUsers(combinedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. This might be due to permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    if (!selectedUser) return;
    
    try {
      // Parse the amount to ensure it's a number
      const numAmount = parseFloat(amount);
      
      if (isNaN(numAmount)) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      setLoading(true);
      
      // Update user balance
      const { data: currentBalance, error: fetchError } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('id', selectedUser.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      const newBalance = (currentBalance?.balance || 0) + numAmount;
      
      const { error: updateError } = await supabase
        .from('user_balances')
        .upsert({
          id: selectedUser.id,
          balance: newBalance,
          updated_at: new Date().toISOString()
        });
        
      if (updateError) {
        throw updateError;
      }
      
      // Add transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: selectedUser.id,
          amount: numAmount,
          transaction_type: 'topup',
          description: 'Admin adjustment'
        });
      
      toast.success(`Added ${numAmount} THB to ${selectedUser.email}'s balance`);
      
      // Refresh the users list
      fetchUsers();
      
      // Reset the form
      setAmount('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding balance:', error);
      toast.error('Failed to add balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pastelPink animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack flex items-center justify-center p-6">
        <Card className="w-full max-w-lg bg-gray-800/80 backdrop-blur-md border border-pastelPink/20">
          <CardHeader>
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription className="text-gray-400">
              You do not have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack p-6">
      <Card className="w-full max-w-6xl mx-auto bg-gray-800/80 backdrop-blur-md border border-pastelPink/20">
        <CardHeader>
          <CardTitle className="text-white">Admin Dashboard</CardTitle>
          <CardDescription className="text-gray-400">
            Manage user balances and view user information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-white">User Management</h2>
              <Button 
                onClick={fetchUsers} 
                variant="outline" 
                className="border-pastelPink/50 text-pastelPink"
              >
                Refresh Users
              </Button>
            </div>
            
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-900/50">
                  <TableRow>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Current Balance</TableHead>
                    <TableHead className="text-gray-300">Last Login</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((userData) => (
                      <TableRow key={userData.id} className="border-t border-gray-700 hover:bg-gray-700/20">
                        <TableCell className="text-gray-200">{userData.email}</TableCell>
                        <TableCell className="text-gray-200">{userData.balance.toFixed(2)} THB</TableCell>
                        <TableCell className="text-gray-200">
                          {userData.last_login ? new Date(userData.last_login).toLocaleString() : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={isDialogOpen && selectedUser?.id === userData.id} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) setSelectedUser(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedUser(userData)}
                                variant="outline" 
                                size="sm"
                                className="text-pastelPink border-pastelPink/30"
                              >
                                Add Balance
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border border-pastelPink/30 text-white">
                              <DialogHeader>
                                <DialogTitle>Add Balance for {selectedUser?.email}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Current balance: {selectedUser?.balance.toFixed(2)} THB
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-300">
                                    Amount to add (THB)
                                  </label>
                                  <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-gray-900/50 border-gray-700 text-white"
                                    placeholder="100.00"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsDialogOpen(false)}
                                  className="border-gray-700 text-gray-300"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleAddBalance}
                                  disabled={loading || !amount}
                                  className="bg-pastelPink hover:bg-pastelPink/80 text-black"
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    'Add Balance'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
