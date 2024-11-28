// import LandingPage from "./landingpage";
import Navbar from "@/app/(dashboard)/welcome/components/Navbar";


export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
  params: { botId: string };
}) {
 
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
