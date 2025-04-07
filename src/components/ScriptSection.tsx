
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const sampleScripts = [
  {
    name: "Hello World",
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
    name: "GUI Example",
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
    name: "Game Loop",
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "Script copied!",
      description: "The script has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="scripts" className="py-20 px-4 gradient-bg">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          <span className="neon-text">Lua</span> Scripts
        </h2>
        
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          Browse example scripts to get started with NeonScript. Copy and modify these templates for your own projects.
        </p>
        
        <Tabs defaultValue="0" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            {sampleScripts.map((script, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="data-[state=active]:text-neonPink data-[state=active]:shadow-[0_0_10px_rgba(255,42,109,0.5)]"
              >
                {script.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sampleScripts.map((script, index) => (
            <TabsContent key={index} value={index.toString()}>
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(script.code, index)}
                    className="bg-black/30 hover:bg-black/50 text-white"
                  >
                    {copiedIndex === index ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <pre className="console-text overflow-x-auto max-h-[400px] overflow-y-auto">
                  <code>{script.code}</code>
                </pre>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button className="neon-button">
                  <Code className="mr-2 h-4 w-4" />
                  Run in NeonScript
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ScriptSection;
