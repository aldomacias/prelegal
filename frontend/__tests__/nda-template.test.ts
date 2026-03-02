import { renderCoverPage, renderStandardTerms, escapeHtml } from "@/lib/nda-template";
import { NdaFormData } from "@/lib/nda-types";

function makeFormData(overrides: Partial<NdaFormData> = {}): NdaFormData {
  return {
    purpose: "Evaluating a business relationship.",
    effectiveDate: "2025-06-15",
    mndaTermType: "expires",
    mndaTermDuration: "1 year",
    confidentialityTermType: "fixed",
    confidentialityTermDuration: "2 years",
    governingLaw: "Delaware",
    jurisdiction: "courts located in New Castle, DE",
    modifications: "",
    party1: {
      name: "Alice Smith",
      title: "CEO",
      company: "Acme Corp",
      noticeAddress: "alice@acme.com",
    },
    party2: {
      name: "Bob Jones",
      title: "CTO",
      company: "Beta Inc",
      noticeAddress: "bob@beta.com",
    },
    ...overrides,
  };
}

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("handles strings with no special characters", () => {
    expect(escapeHtml("normal text")).toBe("normal text");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("escapes multiple special characters together", () => {
    expect(escapeHtml('<div class="test">&</div>')).toBe(
      "&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;"
    );
  });
});

describe("renderCoverPage", () => {
  it("renders all party details", () => {
    const data = makeFormData();
    const html = renderCoverPage(data);

    expect(html).toContain("Alice Smith");
    expect(html).toContain("CEO");
    expect(html).toContain("Acme Corp");
    expect(html).toContain("alice@acme.com");
    expect(html).toContain("Bob Jones");
    expect(html).toContain("CTO");
    expect(html).toContain("Beta Inc");
    expect(html).toContain("bob@beta.com");
  });

  it("renders the purpose", () => {
    const data = makeFormData({ purpose: "Testing partnership viability." });
    const html = renderCoverPage(data);
    expect(html).toContain("Testing partnership viability.");
  });

  it("renders formatted effective date", () => {
    const data = makeFormData({ effectiveDate: "2025-01-15" });
    const html = renderCoverPage(data);
    expect(html).toContain("January 15, 2025");
  });

  it("shows placeholder when effective date is empty", () => {
    const data = makeFormData({ effectiveDate: "" });
    const html = renderCoverPage(data);
    expect(html).toContain("___________");
  });

  it("renders expiring MNDA term", () => {
    const data = makeFormData({
      mndaTermType: "expires",
      mndaTermDuration: "3 years",
    });
    const html = renderCoverPage(data);
    expect(html).toContain("Expires 3 years from Effective Date.");
  });

  it("renders until-terminated MNDA term", () => {
    const data = makeFormData({ mndaTermType: "until_terminated" });
    const html = renderCoverPage(data);
    expect(html).toContain("Continues until terminated");
  });

  it("renders fixed confidentiality term", () => {
    const data = makeFormData({
      confidentialityTermType: "fixed",
      confidentialityTermDuration: "5 years",
    });
    const html = renderCoverPage(data);
    expect(html).toContain("5 years from Effective Date");
  });

  it("renders perpetuity confidentiality term", () => {
    const data = makeFormData({ confidentialityTermType: "perpetuity" });
    const html = renderCoverPage(data);
    expect(html).toContain("In perpetuity.");
  });

  it("renders governing law and jurisdiction", () => {
    const data = makeFormData({
      governingLaw: "California",
      jurisdiction: "courts located in San Francisco, CA",
    });
    const html = renderCoverPage(data);
    expect(html).toContain("California");
    expect(html).toContain("courts located in San Francisco, CA");
  });

  it("shows placeholder for empty governing law", () => {
    const data = makeFormData({ governingLaw: "" });
    const html = renderCoverPage(data);
    expect(html).toContain("[State]");
  });

  it("shows placeholder for empty jurisdiction", () => {
    const data = makeFormData({ jurisdiction: "" });
    const html = renderCoverPage(data);
    expect(html).toContain("[City/County and State]");
  });

  it("renders modifications when provided", () => {
    const data = makeFormData({ modifications: "Section 3 is amended." });
    const html = renderCoverPage(data);
    expect(html).toContain("MNDA Modifications");
    expect(html).toContain("Section 3 is amended.");
  });

  it("hides modifications section when empty", () => {
    const data = makeFormData({ modifications: "" });
    const html = renderCoverPage(data);
    expect(html).not.toContain("MNDA Modifications");
  });

  it("hides modifications section when whitespace only", () => {
    const data = makeFormData({ modifications: "   " });
    const html = renderCoverPage(data);
    expect(html).not.toContain("MNDA Modifications");
  });

  it("shows blank placeholders for empty party fields", () => {
    const data = makeFormData({
      party1: { name: "", title: "", company: "", noticeAddress: "" },
    });
    const html = renderCoverPage(data);
    // Should contain multiple placeholder strings for empty fields
    const placeholderCount = (html.match(/___________/g) || []).length;
    expect(placeholderCount).toBeGreaterThanOrEqual(4);
  });

  // XSS prevention tests
  it("escapes HTML in purpose field", () => {
    const data = makeFormData({
      purpose: '<script>alert("xss")</script>',
    });
    const html = renderCoverPage(data);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes HTML in party names", () => {
    const data = makeFormData({
      party1: {
        name: '<img src=x onerror="alert(1)">',
        title: "CEO",
        company: "Test",
        noticeAddress: "test@test.com",
      },
    });
    const html = renderCoverPage(data);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("escapes HTML in modifications field", () => {
    const data = makeFormData({
      modifications: '<div onmouseover="steal()">hover me</div>',
    });
    const html = renderCoverPage(data);
    expect(html).not.toContain("<div onmouseover");
    expect(html).toContain("&lt;div onmouseover");
  });

  it("escapes HTML in jurisdiction field", () => {
    const data = makeFormData({
      jurisdiction: '"><script>alert(document.cookie)</script>',
    });
    const html = renderCoverPage(data);
    expect(html).not.toContain("<script>");
  });

  it("escapes ampersands in company names", () => {
    const data = makeFormData({
      party1: {
        name: "John",
        title: "CEO",
        company: "Ben & Jerry's",
        noticeAddress: "john@bj.com",
      },
    });
    const html = renderCoverPage(data);
    expect(html).toContain("Ben &amp; Jerry&#39;s");
  });

  // Edge cases
  it("handles very long input strings", () => {
    const longString = "A".repeat(10000);
    const data = makeFormData({ purpose: longString });
    const html = renderCoverPage(data);
    expect(html).toContain(longString);
  });

  it("handles unicode characters", () => {
    const data = makeFormData({
      party1: {
        name: "Jose Garcia",
        title: "Director Ejecutivo",
        company: "Compania S.A.",
        noticeAddress: "jose@compania.com",
      },
    });
    const html = renderCoverPage(data);
    expect(html).toContain("Jose Garcia");
    expect(html).toContain("Compania S.A.");
  });

  it("contains the CC BY 4.0 footer", () => {
    const data = makeFormData();
    const html = renderCoverPage(data);
    expect(html).toContain("CC BY 4.0");
  });

  it("contains the signature table", () => {
    const data = makeFormData();
    const html = renderCoverPage(data);
    expect(html).toContain("signature-table");
    expect(html).toContain("PARTY 1");
    expect(html).toContain("PARTY 2");
  });
});

describe("renderStandardTerms", () => {
  it("renders all 11 sections", () => {
    const data = makeFormData();
    const html = renderStandardTerms(data);

    expect(html).toContain("1. Introduction.");
    expect(html).toContain("2. Use and Protection of Confidential Information.");
    expect(html).toContain("3. Exceptions.");
    expect(html).toContain("4. Disclosures Required by Law.");
    expect(html).toContain("5. Term and Termination.");
    expect(html).toContain("6. Return or Destruction of Confidential Information.");
    expect(html).toContain("7. Proprietary Rights.");
    expect(html).toContain("8. Disclaimer.");
    expect(html).toContain("9. Governing Law and Jurisdiction.");
    expect(html).toContain("10. Equitable Relief.");
    expect(html).toContain("11. General.");
  });

  it("inserts governing law into section 9", () => {
    const data = makeFormData({ governingLaw: "New York" });
    const html = renderStandardTerms(data);
    expect(html).toContain("laws of the State of New York");
  });

  it("inserts jurisdiction into section 9", () => {
    const data = makeFormData({
      jurisdiction: "courts located in Manhattan, NY",
    });
    const html = renderStandardTerms(data);
    expect(html).toContain("courts located in Manhattan, NY");
  });

  it("shows placeholder for empty governing law", () => {
    const data = makeFormData({ governingLaw: "" });
    const html = renderStandardTerms(data);
    expect(html).toContain("[Governing Law]");
  });

  it("shows placeholder for empty jurisdiction", () => {
    const data = makeFormData({ jurisdiction: "" });
    const html = renderStandardTerms(data);
    expect(html).toContain("[Jurisdiction]");
  });

  it("escapes HTML in governing law", () => {
    const data = makeFormData({
      governingLaw: '<script>alert("xss")</script>',
    });
    const html = renderStandardTerms(data);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("contains the CC BY 4.0 footer", () => {
    const data = makeFormData();
    const html = renderStandardTerms(data);
    expect(html).toContain("CC BY 4.0");
  });
});
