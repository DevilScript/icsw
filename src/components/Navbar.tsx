import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Navbar = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const { user, userProfile, userBalance, signOut } = useAuth();

  return (
    <nav className="bg-deepBlack border-b border-pastelPink/20 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          ICSW
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-9 w-9">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback>{userProfile?.nickname?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.nickname || user?.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    {userBalance && (
                      <p className="text-sm text-green-500 balance-update">
                        Balance: {userBalance.balance.toFixed(2)} THB
                      </p>
                    )}
                    <Button variant="outline" size="sm" onClick={signOut} className="mt-2 w-full">
                      Sign Out
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ) : (
            <Button onClick={onLoginClick} className="bg-pastelPink hover:bg-pastelPink/80 text-black">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
