import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background via-card to-primary/5 border-primary/10 hover:scale-[1.02] hover:border-primary/20">
      <div className="mb-4 relative">
        <div className="relative z-10">{icon}</div>
        <div className="absolute -inset-1 rounded-full blur-md bg-primary/20 -z-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gradient">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}