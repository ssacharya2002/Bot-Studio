"use client";

import { ApiAlert } from "@/components/ui/api-alert";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { botId } = useParams();

  const scriptTag = `<script appid="${botId}" src="${process.env.NEXT_PUBLIC_CHATBOT_INTEGRATION_SCRIPT}"></script>`;

  return (
    <div className="p-4 md:p-10">
      <ApiAlert title="CHATBOT_INTEGRATION_SCRIPT" description={scriptTag} />
    </div>
  );
};

export default Page;
