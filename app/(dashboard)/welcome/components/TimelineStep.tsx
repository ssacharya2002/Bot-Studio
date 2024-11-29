"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

export default function TimelineStep({ number, title, description, icon, isLast = false }: TimelineStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative pl-12 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      {!isLast && (
        <motion.div
          className="absolute left-[11px] top-[30px] w-[2px] h-[calc(100%-30px)]"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(var(--border)))"
          }}
        >
          <motion.div
            className="w-full origin-top"
            style={{
              height: lineHeight,
              background: "linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary)/0.3))"
            }}
          />
        </motion.div>
      )}

      {/* Timeline circle */}
      <div className="absolute left-0 top-1">
        <motion.div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            "bg-home-background border-[3px] border-home-primary shadow-[0_0_0_4px_hsl(var(--home-background))]",
            "relative z-10"
          )}
        >
          <div className="w-2 h-2 rounded-full bg-home-primary" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-home-muted-foreground mb-1">
            Step {number}
          </span>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex gap-3 items-start">
          <div className="p-2 rounded-lg bg-home-primary/10 backdrop-blur-sm">
            {icon}
          </div>
          <p className="text-home-muted-foreground pt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}