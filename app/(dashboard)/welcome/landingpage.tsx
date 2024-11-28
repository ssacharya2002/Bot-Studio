"use client";


import { Bot, Zap, MessageSquare } from "lucide-react";
import PricingCard from "./components/PricingCard";
import FeatureCard from "./components/FeatureCard";
import Hero from "./components/Hero";
import Steps from "./components/Steps";
import Footer from "./components/Footer";
import "./components/styles/style.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <main>
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Transform Your Website with AI-Powered Chat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-primary" />}
              title="Easy Setup"
              description="Upload your PDFs and FAQs to create a custom chatbot in minutes"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Intelligent Responses"
              description="Powered by OpenAI and LangChain for accurate, context-aware answers"
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-primary" />}
              title="Seamless Integration"
              description="Simple script tag to embed the chatbot on any website"
            />
          </div>
        </section>

        {/* Steps Section */}
        <Steps />

        {/* Pricing Section */}
        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto" id="pricing">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your Perfect Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              features={[
                "1 Chatbot",
                "100 Daily Requests",
                "Basic Analytics",
                "Standard Support",
                "Community Access"
              ]}
              buttonText="Get Started"
              popular={false}
            />
            <PricingCard
              title="Premium"
              price="$10"
              features={[
                "Create up to 3 Chatbots",
                "Unlimited Requests",
                "Advanced Analytics",
                "Priority Support",
                "Custom Branding",
                "API Access"
              ]}
              buttonText="Upgrade to Premium"
              popular={true}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}