"use client";

// types.ts
export interface NavItem {
  label: string;
  href: string;
}

// components/Navbar.tsx
import { FC } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: {
    image?: string;
    name: string;
  };
}

const navItems: NavItem[] = [
  {
    label: "Documentation",
    href: "/documentation",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const Navbar: FC<NavbarProps> = ({ user }) => {
  const currentUser = useUser().user;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">
                <Bot />
              </span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Studio
            </span>
          </Link>

          {/* Navigation Links and Profile */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center">
              {currentUser ? (
                <UserButton />
              ) : (
                <Link href={"/sign-in"}>
                  <Button>Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
