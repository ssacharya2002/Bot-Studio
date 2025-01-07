import { ApiAlert } from "@/components/ui/api-alert";

const Page = ({ params }: { params: { botId: string } }) => {
  const appId = params.botId;
  const scriptTag = `<script appid="${appId}" src="${process.env.NEXT_PUBLIC_CHATBOT_INTEGRATION_SCRIPT}"></script>`;
  
  return (
    <div className="p-4 md:p-10">
      <ApiAlert title="CHATBOT_INTEGRATION_SCRIPT" description={scriptTag} />
    </div>
  );
};

export default Page;