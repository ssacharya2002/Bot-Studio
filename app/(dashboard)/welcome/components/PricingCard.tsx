import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

export default function PricingCard({
  title,
  price,
  features,
  buttonText,
  popular = false,
}: PricingCardProps) {
  return (
    <Card className={cn(
      "p-8 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
      popular ? "border-home-primary/50 shadow-lg scale-105 bg-gradient-to-br from-home-background via-home-card to-home-primary/5" : 
                "border-home-primary/10 hover:border-home-primary/20 bg-home-card"
    )}>
      {popular && (
        <div className="absolute top-4 right-4">
          <span className="premium-gradient text-home-primary-foreground text-sm py-1 px-3 rounded-full shadow-lg">
            Popular
          </span>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2 text-gradient">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-home-muted-foreground">/month</span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-home-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={cn(
          "w-full",
          popular ? "premium-gradient hover:opacity-90 transition-opacity" : 
                    "bg-home-secondary hover:bg-home-primary/10 transition-colors"
        )}
      >
        {buttonText}
      </Button>
    </Card>
  );
}