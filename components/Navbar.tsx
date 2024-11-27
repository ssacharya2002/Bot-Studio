"use client";

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

const navItems = [
  {
    label: "Documentation",
    href: "/documentation",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const Navbar: FC<NavbarProps> = ({}) => {
  const { user } = useUser();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Studio
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              {user ? (
                <UserButton  />
              ) : (
                <Link href="/sign-in">
                  <Button>Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
