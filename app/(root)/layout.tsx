import { auth } from "@clerk/nextjs/server";
import LandingPage from "./landingpage";
import Navbar from "@/components/Navbar"

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    // redirect("/sign-in");

    return (
      <main>
        <LandingPage />
        {/* {children} */}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
