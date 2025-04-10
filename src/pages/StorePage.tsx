import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/auth';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMapDefinitions, countAvailableKeys, supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Package, Check, X } from 'lucide-react';
import { MapDefinition } from '@/context/auth/types';

const StorePage = () => {
  const [maps, setMaps] = useState<MapDefinition[]>([]);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [availableKeys, setAvailableKeys] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const { user, userBalance, userKeys, refreshUserData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      toast({
        title: "Authentication required",
        description: "Please login to access the store",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load map definitions and available key count
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get map definitions
        const { data: mapData, error: mapError } = await getMapDefinitions();
        if (mapError) throw mapError;
        if (mapData) setMaps(mapData as MapDefinition[]);
        
        // Count available keys
        const { count, error: countError } = await countAvailableKeys();
        if (countError) throw countError;
        if (count !== null) setAvailableKeys(count);
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: "Failed to load store data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleMapSelect = (value: string) => {
    setSelectedMap(value);
  };

  const handleBuyClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase maps",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!selectedMap) {
      toast({
        title: "No map selected",
        description: "Please select a map to purchase",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user already owns this map
    if (userKeys && userKeys.length > 0) {
      const hasMap = userKeys.some(key => 
        key.maps && key.maps.includes(getMapNameById(selectedMap))
      );
      
      if (hasMap) {
        toast({
          title: "Map already owned",
          description: "You already own this map",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Check available keys
    if (availableKeys <= 0) {
      toast({
        title: "Out of stock",
        description: "No keys available. Please try again later",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has enough balance
    const map = maps.find(m => m.id === selectedMap);
    if (map && userBalance && userBalance.balance < map.price) {
      toast({
        title: "Insufficient balance",
        description: `You need ${map.price} THB to purchase this map`,
        variant: "destructive"
      });
      return;
    }
    
    setConfirmDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user || !selectedMap) return;
    
    setPurchasing(true);
    try {
      const selectedMapName = getMapNameById(selectedMap);
      
      const { data, error } = await supabase.functions.invoke('purchase-key', {
        body: { user_id: user.id, map_name: selectedMapName }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Purchase successful!",
          description: `You now own the ${selectedMapName} map`,
          className: "bg-gray-800 border-green-500 text-white",
        });
        
        // Update available keys count
        setAvailableKeys(prevCount => Math.max(0, prevCount - 1));
        
        // Refresh user data
        await refreshUserData();
      } else {
        toast({
          title: "Purchase failed",
          description: data.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      toast({
        title: "Purchase failed",
        description: error.message || "An error occurred during purchase",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
      setConfirmDialogOpen(false);
    }
  };

  const getMapNameById = (id: string): string => {
    const map = maps.find(m => m.id === id);
    return map ? map.name : '';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'wip': return 'bg-yellow-500';
      case 'patched': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedMapData = selectedMap ? maps.find(m => m.id === selectedMap) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white flex justify-center items-center">
        <div className="animate-spin text-pastelPink">
          <Package size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white">
      {/* Custom cursor */}
      <style>
        {`
        body {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='rgba(255,179,209,0.5)' /></svg>"), auto;
        }
        a, button, [role="button"], select, input, label {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><circle cx='10' cy='10' r='8' fill='rgba(255,179,209,0.8)' /></svg>"), pointer !important;
        }
        `}
      </style>
      
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pastelPink/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-500/5 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar onLoginClick={() => navigate('/auth')} />
        
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-center mb-2">Script Store</h1>
            <p className="text-center text-gray-400 mb-8">Purchase premium scripts for your games</p>
            
            {userBalance && (
              <div className="text-center mb-6 glass-effect border border-pastelPink/30 p-4 rounded-lg shadow-[0_0_10px_rgba(255,179,209,0.15)]">
                <p className="text-sm text-gray-400">Your Balance</p>
                <p className="text-2xl font-bold text-pastelPink">{userBalance.balance.toFixed(2)} THB</p>
              </div>
            )}
            
            <div className="glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_20px_rgba(255,179,209,0.15)] mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Select Map</h2>
                <span className="text-sm text-gray-400">Stock: {availableKeys}</span>
              </div>
              
              <Select value={selectedMap || ""} onValueChange={handleMapSelect}>
                <SelectTrigger className="w-full bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink">
                  <SelectValue placeholder="Choose a map" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 backdrop-blur-md border border-pastelPink/30 text-white">
                  {maps.map((map) => (
                    <SelectItem 
                      key={map.id} 
                      value={map.id}
                      className="text-white hover:bg-gray-700/70 focus:text-pastelPink"
                    >
                      {map.name} - {map.price} THB
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <AnimatePresence mode="wait">
                {selectedMapData && (
                  <motion.div
                    key={selectedMapData.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 border border-pastelPink/20 rounded-lg p-4 bg-gray-900/30">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium">{selectedMapData.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Status:</span>
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedMapData.status)} mr-1`}></div>
                            <span className="text-sm">{selectedMapData.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Price</p>
                          <p className="font-semibold">{selectedMapData.price} THB</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Compatible with</p>
                          <p className="font-semibold">{selectedMapData.allowed_place_ids.length} games</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-1">Features</p>
                        <ul className="list-disc pl-5 text-sm">
                          {selectedMapData.features && selectedMapData.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button
                        onClick={handleBuyClick}
                        className="w-full mt-2 bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Need to add funds? <Button variant="link" onClick={() => navigate('/topup')} className="text-pastelPink p-0 h-auto">Go to Topup</Button>
              </p>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
      
      {/* Purchase confirmation dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {selectedMapData && (
                <>
                  Are you sure you want to purchase <span className="text-pastelPink font-semibold">{selectedMapData.name}</span> for <span className="text-pastelPink font-semibold">{selectedMapData.price} THB</span>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPurchase}
              disabled={purchasing}
              className="bg-pastelPink hover:bg-pastelPink/80 text-black"
            >
              {purchasing ? 'Processing...' : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StorePage;
