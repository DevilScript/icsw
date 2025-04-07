
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, Code, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const sampleScripts = [
  {
    name: "Test",
    code: `-- Simple Hello World script
print("Hello, NeonScript world!")

-- Define a function
function greet(name)
  return "Hello, " .. name .. "!"
end

-- Call the function
local message = greet("User")
print(message)`
  },
  {
    name: "Test",
    code: `-- GUI Example with NeonScript library
local window = NeonUI.Window.new("My App", 800, 600)

-- Add a button
local button = NeonUI.Button.new("Click Me!")
button:setPosition(350, 250)
button:setSize(100, 40)

-- Add click event
button:onClick(function()
  NeonUI.MessageBox.show("Hello!", "Button was clicked")
end)

window:add(button)
window:show()`
  },
  {
    name: "Test",
    code: `-- Simple game loop example
local player = {
  x = 100,
  y = 100,
  speed = 5
}

function update(dt)
  -- Move player based on key input
  if NeonInput.isKeyDown("right") then
    player.x = player.x + player.speed * dt
  end
  if NeonInput.isKeyDown("left") then
    player.x = player.x - player.speed * dt
  end
end

function draw()
  NeonGraphics.clear()
  NeonGraphics.drawRect(player.x, player.y, 50, 50)
end

-- Start the game loop
NeonEngine.start(update, draw)`
  }
];

const ScriptSection = () => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedScript, setSelectedScript] = useState<string>("0");
  const [isExpanded, setIsExpanded] = useState(false);
  const scriptRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "Script copied!",
      description: "The script has been copied to your clipboard.",
      className: "bg-gray-800 border border-pastelPink text-white",
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleScriptChange = (value: string) => {
    setSelectedScript(value);
    setIsExpanded(true);
    
    // Scroll to script if needed
    if (scriptRef.current) {
      setTimeout(() => {
        scriptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const currentScript = sampleScripts[parseInt(selectedScript)];

  return (
    <section id="scripts" className="py-20 px-4 bg-gradient-to-b from-darkGray/30 to-deepBlack/90">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          <span className="text-pastelPink">Lua</span> Scripts
        </h2>
        
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          Browse example scripts to get started with NeonScript. Copy and modify these templates for your own projects.
        </p>
        
        <div className="max-w-3xl mx-auto">
          {/* Script Selection Dropdown */}
          <div className="mb-8 relative z-20">
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
          </div>
          
          {/* Script Display with Animation */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                ref={scriptRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative glass-effect border border-pastelPink/30 shadow-[0_0_15px_rgba(255,179,209,0.15)] rounded-xl overflow-hidden mb-4"
              >
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(currentScript.code, parseInt(selectedScript))}
                    className="bg-black/30 hover:bg-black/50 text-white border border-pastelPink/30 rounded-md"
                  >
                    {copiedIndex === parseInt(selectedScript) ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <pre className="font-mono text-green-400 bg-black/80 p-6 overflow-x-auto max-h-[400px] overflow-y-auto text-sm">
                  <code>{currentScript.code}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink shadow-[0_0_10px_rgba(255,179,209,0.2)] rounded-md"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Hide Script
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show Selected 
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScriptSection;
