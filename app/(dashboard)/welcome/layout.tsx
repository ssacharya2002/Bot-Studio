// import LandingPage from "./landingpage";
// import Navbar from "@/app/(dashboard)/welcome/components/Navbar";


export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <>
      {/* <Navbar /> */}
      {children}
    </>
  );
}
