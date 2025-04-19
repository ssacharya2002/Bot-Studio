"use client";

import { bot } from "@prisma/client";
import { useForm } from "react-hook-form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "./file-upload";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import AvatarUpload from "./avatar-upload";

interface BotFormProps {
  initialData: bot | null;
  botId: string;
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  avatar: z.string().min(3, { message: "Avatar is required" }),
  pdfKey: z.string().min(3, { message: "PdfKey is required" }),
  active: z.boolean().default(false),
  email: z.string().min(3, { message: "Email is required" }),
});

const BotForm = ({ initialData, botId }: BotFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      avatar: "",
      pdfKey: "",
      active: true,
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const [toastLoading, setToastLoading] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        setToastLoading(true);
        if (toastLoading) {
          toast.loading("Updating...");
        }
        await axios.patch(`/api/chatbot/${botId}`, values);

        setToastLoading(false);

        toast("Successfully updated");
        router.push(`/project/${botId}`);
      } else {
        setToastLoading(true);
        if (toastLoading) {
          toast.loading("Creating...");
        }
        const data = await axios.post(`/api/chatbot`, values);
        setToastLoading(false);
        toast("Successfully created");
        const botId = data.data.id;
        router.push(`/project/${botId}`);
      }
    } catch (err) {
      toast.error("something went wrong");
      console.log(err);
    } finally {
      setToastLoading(false);
    }
  };

  return (
    <div className="h-full p-4 space-y-2 mx-10">
      <Form {...form}>
        <form
          id="botForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10 flex flex-col md:flex-row md:space-x-8 md:space-y-0 w-full justify-center md:gap-40 items-center md:pt-10 md:pb-20 md:px-10"
        >
          {/* file upload */}
          <div className="flex flex-col items-center justify-center gap-2">
            <FormField
              name="pdfKey"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormControl>
                    <FileUpload
                      disabled={isLoading}
                      onChange={(e: string) => field.onChange(e)}
                      pdfKey={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground whitespace-nowrap ">Upload PDF for Chatbot Responses</p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-1 w-full">
            <div className="col-span-2 md:col-span-1 flex items-center w-full gap-4">
              <FormField
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex-grow-0">
                    <FormControl>
                      <AvatarUpload
                        disabled={isLoading}
                        onChange={(e) => field.onChange(e)}
                        avatarUrl={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 ml-auto">
                    <FormLabel className="text-red-600">Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Bot name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your Bot name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your Email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
        
        <div className="w-full flex justify-center">
          <Button 
            disabled={isLoading} 
            size="lg" 
            type="submit" 
            form="botForm"
          >
            {initialData ? "Edit your Bot" : "Create your Bot"}
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BotForm;