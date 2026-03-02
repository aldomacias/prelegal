"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { NdaFormData } from "@/lib/nda-types";
import { renderCoverPage, renderStandardTerms } from "@/lib/nda-template";

interface NdaPreviewProps {
  data: NdaFormData;
}

export function NdaPreview({ data }: NdaPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  async function downloadPdf() {
    const element = previewRef.current;
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: [10, 15],
        filename: "Mutual-NDA.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();
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
