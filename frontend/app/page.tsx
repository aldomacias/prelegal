"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NdaForm } from "@/components/nda-form";
import { NdaPreview } from "@/components/nda-preview";
import { NdaFormData, createDefaultFormData } from "@/lib/nda-types";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(createDefaultFormData);

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Prelegal</h1>
        <p className="text-sm text-muted-foreground">
          Mutual NDA Creator
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1600px] mx-auto">
        <Card className="lg:max-h-[calc(100vh-120px)] lg:overflow-auto">
          <CardContent className="p-6">
            <NdaForm data={formData} onChange={setFormData} />
          </CardContent>
        </Card>

        <div className="lg:h-[calc(100vh-120px)] lg:sticky lg:top-6">
          <NdaPreview data={formData} />
        </div>
      </main>
    </div>
  );
}
