import { Bot, Github, Twitter } from "lucide-react";
import FooterLink from "./FooterLink";
import FooterSection from "./FooterSection";


export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-background to-secondary/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gradient">Bot Studio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your website with AI-powered chatbots. Engage visitors and provide instant support.
            </p>
            <div className="flex gap-4">
              <FooterLink href="https://twitter.com" className="hover:text-[#1DA1F2]">
                <Twitter className="w-5 h-5" />
              </FooterLink>
              <FooterLink href="https://github.com" className="hover:text-foreground">
                <Github className="w-5 h-5" />
              </FooterLink>
            </div>
          </div>

          {/* Product Section */}
          <FooterSection title="Product">
            <FooterLink href="/features">Features</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/docs">Documentation</FooterLink>
            <FooterLink href="/changelog">Changelog</FooterLink>
          </FooterSection>

          {/* Company Section */}
          <FooterSection title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterSection>

          {/* Legal Section */}
          <FooterSection title="Legal">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/cookies">Cookie Policy</FooterLink>
            <FooterLink href="/security">Security</FooterLink>
          </FooterSection>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-primary/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Bot Studio. All rights reserved.</p>
            <div className="flex gap-4">
              <FooterLink href="/sitemap">Sitemap</FooterLink>
              <FooterLink href="/accessibility">Accessibility</FooterLink>
              <FooterLink href="/status">Status</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}