"use client";

import { Upload, Bot, Code, Zap } from "lucide-react";
import TimelineStep from "./TimelineStep";

export default function Steps() {
  const steps = [
    {
      number: 1,
      title: "Upload Your Content",
      description: "Upload your PDFs, FAQs, or documentation to train your chatbot with your specific content. Our system processes various file formats to extract valuable information.",
      icon: <Upload className="w-5 h-5 text-primary" />,
    },
    {
      number: 2,
      title: "Train Your Bot",
      description: "Our AI processes your content and creates embeddings for accurate, context-aware responses. The advanced machine learning models ensure your chatbot understands and responds naturally.",
      icon: <Bot className="w-5 h-5 text-primary" />,
    },
    {
      number: 3,
      title: "Customize & Configure",
      description: "Personalize your chatbot's appearance and behavior to match your brand and requirements. Adjust the chat interface, response style, and interaction patterns.",
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
    {
      number: 4,
      title: "Integrate & Deploy",
      description: "Add a simple script tag to your website and your AI chatbot is ready to assist visitors. Monitor performance and make adjustments as needed through our dashboard.",
      icon: <Code className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Create Your Chatbot in Minutes</h2>
          <p className="text-xl text-muted-foreground">
            Follow these simple steps to set up your AI-powered chatbot and start engaging with your visitors.
          </p>
        </div>
        
        <div className="relative">
          {steps.map((step, index) => (
            <TimelineStep
              key={step.number}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}