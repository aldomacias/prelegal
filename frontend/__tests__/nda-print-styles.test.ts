import { getNdaDocumentStyles } from "@/lib/nda-print-styles";

describe("getNdaDocumentStyles", () => {
  const styles = getNdaDocumentStyles();

  it("returns a non-empty string", () => {
    expect(styles.length).toBeGreaterThan(0);
  });

  it("includes @page rule for print layout", () => {
    expect(styles).toContain("@page");
    expect(styles).toContain("letter");
  });

  it("sets serif font family", () => {
    expect(styles).toContain("Georgia");
    expect(styles).toContain("Times New Roman");
  });

  it("includes signature table styles", () => {
    expect(styles).toContain(".signature-table");
    expect(styles).toContain("border-collapse");
  });

  it("includes field section styles", () => {
    expect(styles).toContain(".field-section");
    expect(styles).toContain(".field-label");
  });

  it("includes footer note styles", () => {
    expect(styles).toContain(".footer-note");
  });

  it("includes standard terms paragraph styles", () => {
    expect(styles).toContain(".standard-terms p");
    expect(styles).toContain("text-align: justify");
  });
});
