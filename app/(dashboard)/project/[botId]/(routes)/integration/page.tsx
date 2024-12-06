"use client";

import { ApiAlert } from "@/components/ui/api-alert";

// import React from 'react'

const page = async ({ params }: { params: Promise<{ botId: string }> }) => {
  const AppId = (await params).botId;
  const scriptTag = `<script appid="${AppId}" src=${process.env.CHATBOT_INTEGRATION_SCRIPT}></script>`;

  return (
    <div className="p-4 md:p-10">
      <ApiAlert title="CHATBOT_INTEGRATION_SCRIPT" description={scriptTag} />
    </div>
  );
};

export default page;
