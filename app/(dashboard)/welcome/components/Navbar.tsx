"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  SidebarTrigger?: React.ReactNode;
}

export default function Navbar({ SidebarTrigger }: NavbarProps) {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl pr-5">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center ">

        
        {SidebarTrigger}
        {/* Logo */}
        <Link href={"/"} className="px-4">
          <div className="flex items-center gap-2 ">
            <div className="relative">
              <Bot className="w-8 h-8 text-blue-500" />
              <div className="absolute -inset-1 rounded-full blur-lg bg-primary/30 bg-gradient-to-r from-blue-500 to-purple-500 -z-10" />
            </div>
            {/* <Link href={"/"}> */}
            <span className="text-xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Bot Studio
            </span>
          </div>
        </Link>
        </div>

        <div className="flex gap-2">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/docs">Documentation</NavLink>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserButton />
            ) : (
              <Link href="/sign-in" className="">
                <Button variant="ghost" className="w-32">
                  Sign In
                </Button>
              </Link>
            )}

            {/* <Button className="premium-gradient hover:opacity-90 transition-opacity">
            Get Started
          </Button>  */}
          </div>
        </div>
      </div>
    </header>
  );
}
