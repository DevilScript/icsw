
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/40 sm:max-w-md rounded-xl shadow-[0_0_30px_rgba(255,179,209,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-white">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your NeonScript account
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="bg-gray-900/50 border-pastelPink/40 text-white focus:border-pastelPink"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-gray-900/50 border-pastelPink/40 text-white focus:border-pastelPink"
            />
          </div>
          
          <Button className="bg-gray-700/90 hover:bg-gray-600/90 text-white border border-pastelPink w-full shadow-[0_0_10px_rgba(255,179,209,0.2)]">
            Sign In
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-pastelPink/40 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="border-pastelPink/40 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="link" className="text-pastelPink hover:text-white transition-colors">
            Forgot password?
          </Button>
          <Button variant="link" className="text-pastelPink hover:text-white transition-colors">
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
