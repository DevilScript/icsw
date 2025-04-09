
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Code, ChevronDown, ChevronUp, Key, Lock, Unlock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const sampleScripts = [
  {
    id: "basketball",
    name: "BasketBall Legends",
    code: `-- BasketBall Legends Script
-- This script enhances your basketball game experience
local PlayerModule = require(game:GetService("Players").LocalPlayer.PlayerScripts.PlayerModule)
local Controls = PlayerModule:GetControls()

-- Boost player speed
local function boostSpeed()
  local player = game.Players.LocalPlayer
  local character = player.Character or player.CharacterAdded:Wait()
  local humanoid = character:WaitForChild("Humanoid")
  
  humanoid.WalkSpeed = 32 -- Default is 16
  humanoid.JumpPower = 75 -- Default is 50
  
  print("Speed and jump power boosted!")
end

-- Improve shooting accuracy
local function improveAccuracy()
  local shootingModule = game:GetService("ReplicatedStorage").ShootingModule
  
  if shootingModule then
    local oldFunction = shootingModule.CalculateAccuracy
    
    shootingModule.CalculateAccuracy = function(...)
      local result = oldFunction(...)
      return result * 1.4 -- 40% accuracy improvement
    end
    
    print("Shooting accuracy improved by 40%!")
  else
    print("Shooting module not found")
  end
end

-- Initialize enhancements
boostSpeed()
improveAccuracy()

print("BasketBall Legends enhancement script loaded successfully!")`
  },
  {
    id: "animefruit",
    name: "AnimeFruit",
    code: `-- AnimeFruit Script
-- Enhanced gameplay for anime fruit fighting games
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer = Players.LocalPlayer

-- Auto farm function
local function startAutoFarm()
  local farmingEnabled = true
  
  spawn(function()
    while farmingEnabled do
      local nearestEnemy = nil
      local shortestDistance = math.huge
      
      for _, entity in pairs(workspace.Enemies:GetChildren()) do
        if entity:FindFirstChild("HumanoidRootPart") and entity:FindFirstChild("Humanoid") and entity.Humanoid.Health > 0 then
          local distance = (LocalPlayer.Character.HumanoidRootPart.Position - entity.HumanoidRootPart.Position).Magnitude
          
          if distance < shortestDistance then
            shortestDistance = distance
            nearestEnemy = entity
          end
        end
      end
      
      if nearestEnemy and shortestDistance < 500 then
        LocalPlayer.Character.HumanoidRootPart.CFrame = nearestEnemy.HumanoidRootPart.CFrame * CFrame.new(0, 0, 5)
        
        -- Attack enemy
        local args = {
          [1] = nearestEnemy.HumanoidRootPart.Position
        }
        
        ReplicatedStorage.Remotes.Combat:FireServer(unpack(args))
      end
      
      wait(0.5)
    end
  end)
  
  return function() farmingEnabled = false end
end

-- Fruit finder function
local function enableFruitFinder()
  for _, v in pairs(workspace:GetChildren()) do
    if v:IsA("Tool") and v:FindFirstChild("Handle") then
      local highlight = Instance.new("Highlight")
      highlight.FillColor = Color3.fromRGB(255, 0, 255)
      highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
      highlight.Parent = v.Handle
      
      print("Found fruit:", v.Name)
    end
  end
  
  workspace.ChildAdded:Connect(function(child)
    if child:IsA("Tool") and child:FindFirstChild("Handle") then
      wait(1)
      local highlight = Instance.new("Highlight")
      highlight.FillColor = Color3.fromRGB(255, 0, 255)
      highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
      highlight.Parent = child.Handle
      
      print("New fruit spawned:", child.Name)
    end
  end)
end

-- Initialize features
local stopFarming = startAutoFarm()
enableFruitFinder()

print("AnimeFruit enhancement script loaded successfully!")`
  }
];

const ScriptSection = () => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [scriptKey, setScriptKey] = useState<string>("");
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const scriptRef = useRef<HTMLDivElement>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "copied!",
      description: "The script has been copied to your clipboard.",
      className: "bg-gray-800 border border-pastelPink text-white",
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleScriptChange = (value: string) => {
    setSelectedScript(value);
    setIsKeyVerified(false);
    setIsExpanded(false);
    
    if (keyInputRef.current) {
      keyInputRef.current.focus();
    }
  };

  const verifyScriptKey = async () => {
    if (!scriptKey.trim() || !selectedScript) return;
    
    setIsVerifying(true);
    
    try {
      // Call Supabase to verify the key for the selected script
      const { data, error } = await supabase
        .from('script_keys')
        .select('*')
        .eq('script_id', sampleScripts[parseInt(selectedScript)].id)
        .eq('key_value', scriptKey.trim())
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setIsKeyVerified(true);
        setIsExpanded(true);
        
        toast({
          title: "Key verified!",
          description: "You now have access to the script.",
          className: "bg-gray-800 border-green-500 text-white",
        });
        
        // Scroll to script if needed
        if (scriptRef.current) {
          setTimeout(() => {
            scriptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      } else {
        setIsKeyVerified(false);
        
        toast({
          variant: "destructive",
          title: "Invalid key",
          description: "The key you entered is not valid for this script.",
          className: "bg-gray-800 border-red-500 text-white",
        });
      }
    } catch (error) {
      console.error("Error verifying key:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Please try again.",
        className: "bg-gray-800 border-red-500 text-white",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const currentScript = selectedScript ? sampleScripts[parseInt(selectedScript)] : null;

  return (
    <section id="scripts" className="py-20 px-4 bg-gradient-to-b from-darkGray/30 to-deepBlack/90">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title text-center"
        >
          <span className="text-pastelPink">Lua</span> Scripts
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
        >
          I speak Thai, but my code speaks elite.
        </motion.p>
        
        <div className="max-w-3xl mx-auto">
          {/* Script Selection Dropdown */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-8 relative z-20"
          >
            <Select value={selectedScript} onValueChange={handleScriptChange}>
              <SelectTrigger className="w-full glass-effect border border-pastelPink/40 hover:border-pastelPink/70 transition-colors text-white shadow-[0_0_10px_rgba(255,179,209,0.15)]">
                <SelectValue placeholder="Select a script" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 backdrop-blur-md border border-pastelPink/30 text-white">
                {sampleScripts.map((script, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-white hover:bg-gray-700/70 hover:text-pastelPink focus:text-pastelPink"
                  >
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          
          {/* Key Verification Form */}
          {selectedScript !== "" && !isKeyVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.2)] mb-6"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="text-pastelPink mr-2 h-5 w-5 animate-pulse" />
                  <h3 className="text-lg font-medium text-white">ZzzZ</h3>
                </div>
                
                <p className="text-sm text-gray-300 text-center max-w-md">
                  Enter your key below
                </p>
                
                <div className="flex w-full max-w-md space-x-2">
                  <div className="relative flex-1">
                    <Input
                      ref={keyInputRef}
                      type="text"
                      value={scriptKey}
                      onChange={(e) => setScriptKey(e.target.value)}
                      placeholder="Moyx-xxxxxx"
                      className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink text-white placeholder:text-gray-500 pl-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          verifyScriptKey();
                        }
                      }}
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                  
                  <Button
                    onClick={verifyScriptKey}
                    disabled={isVerifying || !scriptKey.trim()}
                    className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                  >
                    {isVerifying ? 'Verifying...' : 'Unlock'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Script Display with Animation */}
          <AnimatePresence mode="wait">
            {isExpanded && isKeyVerified && (
              <motion.div 
                ref={scriptRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20, 
                  scale: 0.95,
                  transition: { 
                    duration: 0.3 
                  }
                }}
                className="relative glass-effect border border-pastelPink/30 shadow-[0_0_15px_rgba(255,179,209,0.15)] rounded-xl overflow-hidden mb-4"
              >
                <div className="absolute top-2 right-2 z-10 flex space-x-2">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(currentScript?.code || "", parseInt(selectedScript))}
                      className="bg-black/30 hover:bg-black/50 text-white border border-pastelPink/30 rounded-md"
                    >
                      {copiedIndex === parseInt(selectedScript) ? 
                        <Check className="h-4 w-4 text-green-400" /> : 
                        <Copy className="h-4 w-4" />
                      }
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsExpanded(false)}
                      className="bg-black/30 hover:bg-black/50 text-white border border-pastelPink/30 rounded-md"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                
                <div className="flex items-center bg-black/50 px-4 py-2 border-b border-pastelPink/20">
                  <Unlock className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-gray-300">Access</span>
                </div>
                
                <motion.pre 
                  className="font-mono text-green-400 bg-black/80 p-6 overflow-x-auto max-h-[400px] overflow-y-auto text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { 
                      delay: 0.1, 
                      duration: 0.4 
                    } 
                  }}
                >
                  <code>{currentScript?.code}</code>
                </motion.pre>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="mt-4 flex justify-end"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            {currentScript && isKeyVerified && !isExpanded && (
              <Button 
                className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink shadow-[0_0_10px_rgba(255,179,209,0.2)] rounded-md"
                onClick={() => setIsExpanded(true)}
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                Show Script
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScriptSection;
