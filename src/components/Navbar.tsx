
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Navbar = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const { user, userProfile, userBalance, signOut } = useAuth();

  return (
    <nav className="bg-deepBlack border-b border-pastelPink/20 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          ICSW
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="text-white hover:text-pastelPink px-4 py-2 transition-colors">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/store">
                  <NavigationMenuLink className="text-white hover:text-pastelPink px-4 py-2 transition-colors">
                    Store
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/topup">
                  <NavigationMenuLink className="text-white hover:text-pastelPink px-4 py-2 transition-colors">
                    Topup
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-pastelPink px-4 py-2 transition-colors bg-transparent hover:bg-transparent">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px] bg-gray-800/95 backdrop-blur-md border border-pastelPink/30 rounded-md">
                    <li>
                      <Link to="/history">
                        <NavigationMenuLink className="text-white hover:text-pastelPink px-2 py-2 block transition-colors">
                          History
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/reset-hwid">
                        <NavigationMenuLink className="text-white hover:text-pastelPink px-2 py-2 block transition-colors">
                          Reset HWID
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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
