
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
import { getScriptKeys, supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/auth';

const sampleScripts = [
  {
    id: "loader",
    name: "Loader",
    code: `getgenv().key = 'YOUR_KEY_HERE'
-----------------------------------------------------------------
local p1, p2, p3 = "htt", "hub", "cod"   
local p4, p5, p6 = "git", "ps:/", "src"    
local q1, q2, q3 = "/raw.", "rep", "usr"    
local q4, q5, q6 = "bit", "github", "com"  
local r1, r2, r3 = "user", "ref", "moy"   
local r4, r5, r6 = "raw", "content", "dat" 
local s1, s2, s3 = "eon", ".com/moyx-", "fs/"
local s4, s5, s6 = "labs/Basket", "bal", "LG/" 
local t1, t2, t3 = "l-LG/re", "fs/hea", "ds/"   
local t4, t5, t6 = "ma", "in/BLG", "ge/"   
local u1, u2, u3 = "s/main/", "bit/", "raw"  
local u4, u5, u6 = "in_", "main_d", "rep"    
local v1, v2, v3 = "ungeon", "src/", ""      
local v4, v5, v6 = ".lua", "cod", "hub" 
local linkMoyx = p1 .. p5 .. q1 .. q5 .. r1 .. r5 .. s2 .. s4 .. t1 .. t5 .. u1 .. u5 .. v1 .. v4

local scriptData = game:HttpGet(linkMoyx, true)
loadstring(scriptData)()`
  },
  {
    id: "yield",
    name: "Yield (free)",
    code: `loadstring(game:HttpGet(('https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source'),true))()`
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
  const { user, userKeys } = useAuth();

  useEffect(() => {
    // If user is logged in and has keys, pre-fill the key field
    if (user && userKeys && userKeys.length > 0 && userKeys[0].key_value) {
      setScriptKey(userKeys[0].key_value);
    }
  }, [user, userKeys]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "Copied!",
      description: "The script has been copied to your clipboard.",
      className: "bg-gray-800 border border-pastelPink text-white",
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleScriptChange = (value: string) => {
    setSelectedScript(value);
    
    // If it's a free script, auto-verify
    const script = sampleScripts[parseInt(value)];
    if (script && script.name.toLowerCase().includes("free")) {
      setIsKeyVerified(true);
      setIsExpanded(true);
    } else {
      setIsKeyVerified(false);
      setIsExpanded(false);
      
      if (keyInputRef.current) {
        keyInputRef.current.focus();
      }
    }
  };

  const verifyScriptKey = async () => {
    if (!scriptKey.trim() || !selectedScript || !user) return;
    
    setIsVerifying(true);
    
    try {
      // Check if the key exists in the keys table
      const { data: keyData, error: keyError } = await supabase
        .from('keys')
        .select('*')
        .eq('key', scriptKey.trim())
        .single();
      
      if (keyError) {
        console.error("Error checking key:", keyError);
        throw new Error("Invalid key or key not found");
      }
      
      if (keyData) {
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

  // Get script code with user's key if authenticated
  const getScriptCodeWithKey = () => {
    if (!currentScript) return "";
    
    let code = currentScript.code;
    
    // Replace placeholder with user's actual key if available
    if (currentScript.id === "loader" && scriptKey) {
      code = code.replace("YOUR_KEY_HERE", scriptKey);
    }
    
    return code;
  };

  const currentScript = selectedScript ? sampleScripts[parseInt(selectedScript)] : null;
  const requiresKey = currentScript ? !currentScript.name.toLowerCase().includes("free") : false;

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
          {selectedScript !== "" && !isKeyVerified && requiresKey && (
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
                    disabled={isVerifying || !scriptKey.trim() || !user}
                    className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                  >
                    {isVerifying ? 'Verifying...' : 'Unlock'}
                  </Button>
                </div>
                
                {!user && (
                  <p className="text-xs text-pastelPink mt-2">
                    You need to login first to verify your key.
                  </p>
                )}
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
                      onClick={() => copyToClipboard(getScriptCodeWithKey(), parseInt(selectedScript))}
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
                  className="font-mono text-white/90 bg-black/80 p-6 overflow-x-auto max-h-[400px] overflow-y-auto text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { 
                      delay: 0.1, 
                      duration: 0.4 
                    } 
                  }}
                >
                  <code>{getScriptCodeWithKey()}</code>
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
