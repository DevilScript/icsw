
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

const features = [
  "Fast Lua script execution",
  "Built-in code editor",
  "Real-time debugging",
  "Script library access",
  "Community integrations",
  "Regular updates"
];

const DownloadSection = () => {
  return (
    <section id="download" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          <span className="text-pastelPink">Download</span> NeonScript Runner
        </h2>
        
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-14">
          Get the latest version of our powerful Lua script runner and start 
          building amazing projects with our intuitive tools.
        </p>
        
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/30 shadow-[0_0_25px_rgba(255,179,209,0.2)] overflow-hidden rounded-xl">
            <CardHeader className="bg-gradient-to-r from-pastelPink/10 to-purple-400/10 border-b border-pastelPink/20">
              <CardTitle className="text-xl text-white">NeonScript Runner v2.5.0</CardTitle>
              <CardDescription className="text-gray-300">The ultimate Lua development environment</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-pastelPink mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button className="relative group overflow-hidden w-full bg-gray-800/70 border-2 border-pastelPink hover:bg-gray-700/70 text-white text-lg py-6 rounded-md shadow-[0_0_15px_rgba(255,179,209,0.3)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pastelPink/0 via-pastelPink/30 to-pastelPink/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                <Download className="mr-2 h-5 w-5" />
                Download Now
              </Button>
              <p className="text-xs text-center text-gray-400">
                Available for Windows, macOS, and Linux. 64-bit systems only.
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center">
            <a href="#" className="text-pastelPink hover:text-white transition-colors text-sm">
              View all previous versions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
