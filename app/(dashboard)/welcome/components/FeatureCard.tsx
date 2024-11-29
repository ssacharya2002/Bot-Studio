import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-home-background via-home-card to-home-primary/5 border-home-primary/10 hover:scale-[1.02] hover:border-home-primary/20">
      <div className="mb-4 relative">
        <div className="relative z-10">{icon}</div>
        <div className="absolute -inset-1 rounded-full blur-md bg-home-primary/20 -z-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gradient">{title}</h3>
      <p className="text-home-muted-foreground">{description}</p>
    </Card>
  );
}