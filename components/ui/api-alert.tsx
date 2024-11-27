"use client";
import { Code2, Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "./button";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  //   variant: "public" | "admin";
}

// const textMap: Record<ApiAlertProps["variant"], string> = {
//   public: "Public",
//   admin: "Admin",
// };

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  //   variant = "public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="gap-2 flex flex-col">
      <div>
        <h3 className="text-2xl font-semibold">Integration Guide</h3>
        <ol className="list-decimal list-inside text-gray-700 space-y-3">
          <li>Copy the provided script tag</li>
          <li>Paste in your website's HTML &lt;head&gt; section</li>
        </ol>
      </div>

      <Alert className="px-4 max-w-xl">
        <Code2 className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-x-2">
          {title}
        </AlertTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="absolute top-2 right-2 px-4"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <AlertDescription className="mt-4 flex items-center justify-between">
          <div className="relative w-full">
            <code className="block rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold overflow-auto">
              {description}
            </code>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
