"use client";

import axios from "axios";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileUploadProps {
  pdfKey: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const handleUpload = async (file: File) => {
  try {
    const { data } = await axios.get(`/api/chatbot/getsignurl`);

    const { uploadUrl, Key } = data;

    await axios.put(uploadUrl, file);

    return Key;
  } catch (err) {
    console.error(err);
    toast.error(`something went wrong ${err}`);
  }
};
const FileUpload: React.FC<FileUploadProps> = ({
  pdfKey,
  onChange,
  disabled,
}) => {
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file?.type !== "application/pdf") {
        return toast.error("Only pdf files are supported");
      }

      if (file?.size > 500 * 1024) {
        return toast.error("File too large (>500kb)");
      }

      if (file) {
        try {
          setUploading(true);

          const Key = await handleUpload(file);

          if (!Key) {
            setUploading(false);
          }

          onChange(Key);
        } catch (err) {
          toast.error(`something went wrong ${err}`);
        } finally {
          setUploading(false);
        }
      }
    },
  });

  return (
    <div className="space-y-1 bg-primary/10  p-2 rounded-lg shadow-lg">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 border-gray-600 h-44 w-36 flex justify-center items-center text-center rounded-lg",
        })}
      >
        <input {...getInputProps()} disabled={uploading || disabled} />

        {pdfKey ? (
          <div>
            <FileText className="w-20 h-24  text-blue-600" />
          </div>
        ) : (
          <p className="text-sm text-black  ">
            {uploading ? (
              <Loader2 className="mr-2 h-6 w-6 text-blue-600 animate-spin" />
            ) : (
              <>
                <span className="w-full flex justify-center mb-2">
                  <UploadCloud className=" mr-2 h-7 w-7 text-blue-600" />
                </span>
                <span className="font-semibold">Upload a PDF</span>
                <br /> or drag and drop
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
