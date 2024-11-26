"use client";

// PDFViewer.tsx
import React from "react";

interface PDFViewerProps {
  pdf_url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf_url }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
      <iframe
        src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;