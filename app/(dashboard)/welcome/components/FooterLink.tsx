import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function FooterLink({ href, children, className }: FooterLinkProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "text-muted-foreground hover:text-primary transition-colors duration-200",
        className
      )}
    >
      {children}
    </Link>
  );
}