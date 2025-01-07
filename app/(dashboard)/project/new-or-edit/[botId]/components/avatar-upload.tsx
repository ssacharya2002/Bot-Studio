import { uploadToCloudinary } from "@/lib/clodinary";
import { Inbox, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface AvatarUploadProps {
  avatarUrl: string;
  onChange: (date: string) => void;
  disabled: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  
  onChange,
  avatarUrl,
}) => {
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": ["*.png", "*.jpg", "*.jpeg"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        return toast.error("File too large");
      }

      try {
        setUploading(true);
        const data = await uploadToCloudinary(file);
        if (!data?.url) {
          return toast("Something went wrong!");
        }

        setUploading(false);

        const url = data.url;
        onChange(url);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="w-full flex justify-start sm:justify-center">
      <div className="p-5 flex justify-center items-center gap-5">
      <h3 className="text-sm font-semibold">Avatar</h3>
        <div
          {...getRootProps()}
          className="border-dashed border-2 rounded-full w-24 h-24 cursor-pointer bg-primary/10 flex justify-center items-center flex-col overflow-hidden"
        >
          <input {...getInputProps()} />
          {!avatarUrl ? (
            uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <p className="mt-1 text-xs text-slate-400 text-primary-foreground text-center">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Inbox className="w-6 h-6 text-blue-500" />
                <p className="mt-1 text-xs text-slate-400 text-center">
                  Upload logo
                </p>
              </>
            )
          ) : (
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={avatarUrl}
                alt="avatar"
                className="rounded-full object-cover"
                fill
                sizes="96px"
              />
            </div>
          )}
        </div>
       
      </div>
    </div>
  );
};

export default AvatarUpload;
