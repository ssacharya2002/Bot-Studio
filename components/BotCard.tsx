"use client";

// import { Bot } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, FileText, MoreVertical, Power, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { bot } from "@prisma/client";
import { GetPdfUrl } from "@/lib/s3";
import Link from "next/link";

interface BotCardProps {
  bot: bot;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
}

export function BotCard({ bot, onDelete, onToggleActive }: BotCardProps) {
  const initials = bot.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();


  return (
    <Link href={`/project/${bot.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                <AvatarImage src={bot.avatar} alt={bot.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold leading-none tracking-tight">
                  {bot.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(bot.createdAt))} ago
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  aria-label="Open menu"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onToggleActive?.(bot.id, !bot.active)}
                  className="cursor-pointer"
                >
                  <Power className="mr-2 h-4 w-4" />
                  {bot.active ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                  <Link href={`/project/new-or-edit/${bot.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                  </Link>
                <DropdownMenuItem
                  onClick={() => onDelete?.(bot.id)}
                  className="cursor-pointer text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center space-x-2">
            <Badge variant={bot.active ? "default" : "secondary"}>
              {bot.active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <FileText className="mr-1 h-3 w-3" />
              PDF Loaded
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              window.open(
                `https://docs.google.com/gview?url=https://bot-studio-ssacharya.s3.ap-south-1.amazonaws.com/${bot.pdfKey}`,
                "_blank"
              )
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            View PDF
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
