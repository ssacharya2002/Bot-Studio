import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center h-screen w-full justify-center">
      {children}
    </div>
  );
}
