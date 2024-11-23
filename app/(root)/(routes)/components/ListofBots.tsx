"use client";

import { Button } from "@/components/ui/button";
import { bot } from "@prisma/client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { BotCards } from "@/components/BotCards";

interface ListOfBotsProps {
  chatBots: bot[] | null;
}

function ListOfBots({ chatBots }: ListOfBotsProps) {
  // const user = await useUser().user;

  return (
    <div>
      {/* <Navbar /> */}

      <div className="mt-5 px-5 ">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold">Projects</h3>

          <Link href="/project/new-or-edit/new">
            <Button size="sm" >
              {" "}
              + New
            </Button>
          </Link>
        </div>

        <Separator className="my-2" />

        <BotCards initialBots={chatBots ?? []}/>
      </div>
    </div>
  );
}

export default ListOfBots;
