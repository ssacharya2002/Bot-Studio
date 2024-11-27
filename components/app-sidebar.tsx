"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  // Bot,
  Command,
  // Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { bot } from "@prisma/client";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
};

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  bot: bot | null;
  user: { name: string | null; email: string| null; avatar: string };
}
export function AppSidebar({ user, bot, ...props }: AppSidebarProps) {
  // const user = useUser().user;

  // if (!user) {
  //   return null;
  // }

  const userData = {
    // name: user.firstName + " " + user.lastName,
    name: user.name,
    // email: user.emailAddresses[0].emailAddress,
    email: user.email,
    avatar: user.avatar,
  };

  const navMain = [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chat",
          url: `/project/${bot?.id}`,
        },
        {
          title: "Integration",
          url: `/project/${bot?.id}/integration`,
        },

        {
          title: "Edit",
          url: `/project/new-or-edit/${bot?.id}`,
        },
      ],
    },
    {
      title: "Documentation",
      url: "project",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: `/project/${bot?.id}/introduction`,
        },

        {
          title: "Get Started",
          url: `/project/${bot?.id}/get-started`,
        },
        {
          title: "Integration",
          url: `/project/${bot?.id}/integration`,
        },
        {
          title: "Tutorials",
          url: `/project/${bot?.id}/tutorials`,
        },
      ],
    },
    {
      title: "Settings",
      url: `#`,
      icon: Settings2,
      items: [
        {
          title: "General",
          url: `/project/${bot?.id}/general`,
        },
        {
          title: "Billing",
          url: `/project/${bot?.id}/billing`,
        },
        {
          title: "Usage",
          url: `/project/${bot?.id}/usage`,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <h2 className="text-lg font-semibold  w-full px-5">{bot?.name}</h2>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
