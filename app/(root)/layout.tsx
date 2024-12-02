import { auth } from "@clerk/nextjs/server";
// import LandingPage from "./landingpage";
import Navbar from "../(dashboard)/welcome/components/Navbar";
import { redirect } from "next/navigation";
// import Navbar from "@/components/Navbar"

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/welcome");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
