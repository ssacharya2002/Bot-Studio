"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 z-0" />
      
      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <Bot className="w-16 h-16 mx-auto mb-8 text-gradient glow" />
            <div className="absolute -inset-1 rounded-full blur-lg bg-primary/30 -z-10" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Bot Studio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Create intelligent chatbots powered by AI. Upload your content, customize your bot,
            and engage your visitors like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 premium-gradient hover:opacity-90 transition-opacity">
              Get Started Free
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-primary/20 hover:bg-primary/10 transition-colors"
            >
              View Demo
            </Button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}