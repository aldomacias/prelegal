"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { NdaFormData } from "@/lib/nda-types";
import { renderCoverPage, renderStandardTerms } from "@/lib/nda-template";
import { getNdaDocumentStyles } from "@/lib/nda-print-styles";

interface NdaPreviewProps {
  data: NdaFormData;
}

export function NdaPreview({ data }: NdaPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  function downloadPdf() {
    const element = previewRef.current;
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mutual NDA</title>
          <style>${getNdaDocumentStyles()}</style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  const coverPageHtml = renderCoverPage(data);
  const standardTermsHtml = renderStandardTerms(data);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Document Preview</h2>
        <Button onClick={downloadPdf}>Download PDF</Button>
      </div>
      <div className="flex-1 overflow-auto border rounded-lg bg-white">
        <div ref={previewRef} className="nda-document p-8">
          <div dangerouslySetInnerHTML={{ __html: coverPageHtml }} />
          <hr className="my-8" />
          <div dangerouslySetInnerHTML={{ __html: standardTermsHtml }} />
        </div>
      </div>
    </div>
  );
}
