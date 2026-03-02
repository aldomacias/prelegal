"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NdaFormData, PartyInfo, US_STATES } from "@/lib/nda-types";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

export function NdaForm({ data, onChange }: NdaFormProps) {
  function update(fields: Partial<NdaFormData>) {
    onChange({ ...data, ...fields });
  }

  function updateParty(party: "party1" | "party2", fields: Partial<PartyInfo>) {
    onChange({ ...data, [party]: { ...data[party], ...fields } });
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Agreement Details</h3>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Input
            id="purpose"
            value={data.purpose}
            onChange={(e) => update({ purpose: e.target.value })}
            placeholder="How Confidential Information may be used"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Effective Date</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={data.effectiveDate}
            onChange={(e) => update({ effectiveDate: e.target.value })}
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">MNDA Term</h3>
        <p className="text-sm text-muted-foreground">The length of this MNDA</p>
        <RadioGroup
          value={data.mndaTermType}
          onValueChange={(v) =>
            update({ mndaTermType: v as NdaFormData["mndaTermType"] })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expires" id="mnda-expires" />
            <Label htmlFor="mnda-expires">Expires after a set period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="until_terminated" id="mnda-terminated" />
            <Label htmlFor="mnda-terminated">
              Continues until terminated
            </Label>
          </div>
        </RadioGroup>
        {data.mndaTermType === "expires" && (
          <div className="space-y-2">
            <Label htmlFor="mndaTermDuration">Duration</Label>
            <Input
              id="mndaTermDuration"
              value={data.mndaTermDuration}
              onChange={(e) => update({ mndaTermDuration: e.target.value })}
              placeholder="e.g., 1 year, 2 years"
            />
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Term of Confidentiality</h3>
        <p className="text-sm text-muted-foreground">
          How long Confidential Information is protected
        </p>
        <RadioGroup
          value={data.confidentialityTermType}
          onValueChange={(v) =>
            update({
              confidentialityTermType:
                v as NdaFormData["confidentialityTermType"],
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="conf-fixed" />
            <Label htmlFor="conf-fixed">Fixed period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="perpetuity" id="conf-perpetuity" />
            <Label htmlFor="conf-perpetuity">In perpetuity</Label>
          </div>
        </RadioGroup>
        {data.confidentialityTermType === "fixed" && (
          <div className="space-y-2">
            <Label htmlFor="confidentialityTermDuration">Duration</Label>
            <Input
              id="confidentialityTermDuration"
              value={data.confidentialityTermDuration}
              onChange={(e) =>
                update({ confidentialityTermDuration: e.target.value })
              }
              placeholder="e.g., 1 year, 2 years"
            />
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Governing Law & Jurisdiction</h3>

        <div className="space-y-2">
          <Label htmlFor="governingLaw">Governing Law (State)</Label>
          <Select
            value={data.governingLaw}
            onValueChange={(v) => update({ governingLaw: v })}
          >
            <SelectTrigger id="governingLaw">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jurisdiction">Jurisdiction</Label>
          <Input
            id="jurisdiction"
            value={data.jurisdiction}
            onChange={(e) => update({ jurisdiction: e.target.value })}
            placeholder="e.g., courts located in New Castle, DE"
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Modifications</h3>
        <div className="space-y-2">
          <Label htmlFor="modifications">
            MNDA Modifications (optional)
          </Label>
          <Input
            id="modifications"
            value={data.modifications}
            onChange={(e) => update({ modifications: e.target.value })}
            placeholder="List any modifications to the MNDA"
          />
        </div>
      </section>

      <Separator />

      <PartySection
        title="Party 1"
        party={data.party1}
        onChange={(fields) => updateParty("party1", fields)}
      />

      <Separator />

      <PartySection
        title="Party 2"
        party={data.party2}
        onChange={(fields) => updateParty("party2", fields)}
      />
    </div>
  );
}

function PartySection({
  title,
  party,
  onChange,
}: {
  title: string;
  party: PartyInfo;
  onChange: (fields: Partial<PartyInfo>) => void;
}) {
  const prefix = title.toLowerCase().replace(" ", "");
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-name`}>Name</Label>
          <Input
            id={`${prefix}-name`}
            value={party.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-title`}>Title</Label>
          <Input
            id={`${prefix}-title`}
            value={party.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Job title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-company`}>Company</Label>
          <Input
            id={`${prefix}-company`}
            value={party.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="Company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}-address`}>Notice Address</Label>
          <Input
            id={`${prefix}-address`}
            value={party.noticeAddress}
            onChange={(e) => onChange({ noticeAddress: e.target.value })}
            placeholder="Email or postal address"
          />
        </div>
      </div>
    </section>
  );
}
