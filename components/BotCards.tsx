"use client";

// import { Bot } from "@/types";
import { BotCard } from "@/components/BotCard";
import { bot } from "@prisma/client";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

interface BotCardsProps {
  initialBots: bot[];
}

export function BotCards({ initialBots }: BotCardsProps) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    console.log("Delete bot:", id);

    // Add your delete logic here

    const data = await axios.delete(`/api/chatbot/${id}`);
    if (data.data.Success) {
      toast.success("Successfully deleted");
    }

    redirect("/");
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    console.log("Toggle bot:", id, "active:", active);
    
    const data = await axios.get(`/api/chatbot/${id}/toggleactivate`);
    if (data.data.Success) {
      toast.success("Successfully updated");
    }

    router.refresh();
    console.log("Toggle bot:", id, "active:", active);
  };

  return (
    <div className="grid gap-6  sm:grid-cols-2 lg:grid-cols-3">
      {initialBots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={bot}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      ))}
    </div>
  );
}
