import { createDefaultFormData, US_STATES, NdaFormData } from "@/lib/nda-types";

describe("createDefaultFormData", () => {
  it("returns a valid NdaFormData object", () => {
    const data = createDefaultFormData();
    expect(data).toBeDefined();
    expect(data.purpose).toBeTruthy();
    expect(data.effectiveDate).toBeTruthy();
    expect(data.party1).toBeDefined();
    expect(data.party2).toBeDefined();
  });

  it("sets effectiveDate to today", () => {
    const data = createDefaultFormData();
    const today = new Date().toISOString().split("T")[0];
    expect(data.effectiveDate).toBe(today);
  });

  it("returns a fresh object each time (no shared references)", () => {
    const data1 = createDefaultFormData();
    const data2 = createDefaultFormData();
    expect(data1).not.toBe(data2);
    expect(data1.party1).not.toBe(data2.party1);
    expect(data1.party2).not.toBe(data2.party2);
  });

  it("defaults to expires MNDA term type", () => {
    const data = createDefaultFormData();
    expect(data.mndaTermType).toBe("expires");
  });

  it("defaults to fixed confidentiality term", () => {
    const data = createDefaultFormData();
    expect(data.confidentialityTermType).toBe("fixed");
  });

  it("defaults to empty party fields", () => {
    const data = createDefaultFormData();
    expect(data.party1.name).toBe("");
    expect(data.party1.title).toBe("");
    expect(data.party1.company).toBe("");
    expect(data.party1.noticeAddress).toBe("");
    expect(data.party2.name).toBe("");
    expect(data.party2.title).toBe("");
    expect(data.party2.company).toBe("");
    expect(data.party2.noticeAddress).toBe("");
  });

  it("defaults to empty governing law and jurisdiction", () => {
    const data = createDefaultFormData();
    expect(data.governingLaw).toBe("");
    expect(data.jurisdiction).toBe("");
  });

  it("defaults to empty modifications", () => {
    const data = createDefaultFormData();
    expect(data.modifications).toBe("");
  });
});

describe("US_STATES", () => {
  it("contains all 50 states", () => {
    expect(US_STATES).toHaveLength(50);
  });

  it("is sorted alphabetically", () => {
    const sorted = [...US_STATES].sort();
    expect(US_STATES).toEqual(sorted);
  });

  it("includes specific states", () => {
    expect(US_STATES).toContain("California");
    expect(US_STATES).toContain("New York");
    expect(US_STATES).toContain("Texas");
    expect(US_STATES).toContain("Delaware");
    expect(US_STATES).toContain("Wyoming");
    expect(US_STATES).toContain("Alabama");
  });

  it("does not include territories", () => {
    expect(US_STATES).not.toContain("Puerto Rico");
    expect(US_STATES).not.toContain("Guam");
    expect(US_STATES).not.toContain("District of Columbia");
  });
});

describe("NdaFormData type shape", () => {
  it("allows all valid mndaTermType values", () => {
    const data = createDefaultFormData();
    data.mndaTermType = "expires";
    expect(data.mndaTermType).toBe("expires");
    data.mndaTermType = "until_terminated";
    expect(data.mndaTermType).toBe("until_terminated");
  });

  it("allows all valid confidentialityTermType values", () => {
    const data = createDefaultFormData();
    data.confidentialityTermType = "fixed";
    expect(data.confidentialityTermType).toBe("fixed");
    data.confidentialityTermType = "perpetuity";
    expect(data.confidentialityTermType).toBe("perpetuity");
  });
});
