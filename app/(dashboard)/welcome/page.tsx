"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Home from "./landingpage"; 
import Script from "next/script";

function Page() {
  const pathname = usePathname();

  const isTargetPage = pathname === "/welcome";

  return (
    <div>
      <Navbar />
      <Home />
      {/* //@ts-expect-error appid */}
      {isTargetPage && (
        <Script
          src="https://res.cloudinary.com/dt43piwsk/raw/upload/v1733587999/ygx2bnrvmrsgevsb7cvf.js"
          data-appid={process.env.NEXT_PUBLIC_CHATBOT_APP_ID}
          strategy="lazyOnload"
        />
      )}
    </div>
  );
}

export default Page;
