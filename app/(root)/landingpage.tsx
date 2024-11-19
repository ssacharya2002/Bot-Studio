"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/Navbar"

function LandingPage() {
  return (
    <div>
      <Navbar />
      this is the landing page header
      <div>body </div>
      <footer> this the footer</footer>
      <Button
        onClick={() => {
          redirect("/sign-in");
        }}
      >
        Sign-In
      </Button>
    </div>
  );
}

export default LandingPage;
