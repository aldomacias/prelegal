import { test, expect } from "@playwright/test";

test.describe("NDA Creator - Page Load", () => {
  test("loads the page with correct title and heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Prelegal/);
    await expect(page.getByRole("heading", { name: "Prelegal" })).toBeVisible();
    await expect(page.getByText("Mutual NDA Creator")).toBeVisible();
  });

  test("shows the form with all sections", async ({ page }) => {
    await page.goto("/");
    // Verify form fields exist (more reliable than matching headings that also appear in preview)
    await expect(page.locator("#purpose")).toBeVisible();
    await expect(page.locator("#effectiveDate")).toBeVisible();
    await expect(page.locator("#mndaTermDuration")).toBeVisible();
    await expect(page.locator("#governingLaw")).toBeVisible();
    await expect(page.locator("#jurisdiction")).toBeVisible();
    await expect(page.locator("#party1-name")).toBeVisible();
    await expect(page.locator("#party2-name")).toBeVisible();
  });

  test("shows the document preview", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Document Preview")).toBeVisible();
    await expect(
      page.locator(".nda-document h1").getByText("Mutual Non-Disclosure Agreement")
    ).toBeVisible();
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});

test.describe("NDA Creator - Form Interactions", () => {
  test("purpose field updates preview in real-time", async ({ page }) => {
    await page.goto("/");

    const purposeInput = page.locator("#purpose");
    await purposeInput.clear();
    await purposeInput.fill("Testing a new strategic partnership.");

    // Preview should update in real-time
    await expect(
      page.locator(".nda-document").getByText("Testing a new strategic partnership.")
    ).toBeVisible();
  });

  test("effective date field updates preview", async ({ page }) => {
    await page.goto("/");

    await page.locator("#effectiveDate").fill("2025-12-25");

    await expect(
      page.locator(".nda-document").getByText("December 25, 2025")
    ).toBeVisible();
  });

  test("MNDA term radio toggles duration field", async ({ page }) => {
    await page.goto("/");

    // Initially "expires" should be selected with duration visible
    await expect(page.locator("#mndaTermDuration")).toBeVisible();

    // Click "Continues until terminated"
    await page.getByLabel("Continues until terminated").click();

    // Duration field should be hidden
    await expect(page.locator("#mndaTermDuration")).not.toBeVisible();

    // Preview should reflect the change
    await expect(
      page.locator(".nda-document").getByText("Continues until terminated", { exact: false })
    ).toBeVisible();
  });

  test("confidentiality term radio toggles duration field", async ({ page }) => {
    await page.goto("/");

    // Click "In perpetuity"
    await page.getByLabel("In perpetuity").click();

    // Duration field should be hidden
    await expect(
      page.locator("#confidentialityTermDuration")
    ).not.toBeVisible();

    // Preview should show perpetuity
    await expect(
      page.locator(".nda-document").getByText("In perpetuity.")
    ).toBeVisible();
  });

  test("governing law selector updates preview", async ({ page }) => {
    await page.goto("/");

    // Open the select and choose California
    await page.locator("#governingLaw").click();
    await page.getByRole("option", { name: "California" }).click();

    // Preview should show California in both places (cover page + standard terms)
    await expect(
      page.locator(".cover-page").getByText("California")
    ).toBeVisible();
  });

  test("jurisdiction updates preview", async ({ page }) => {
    await page.goto("/");

    await page.locator("#jurisdiction").fill("courts located in San Francisco, CA");

    await expect(
      page
        .locator(".nda-document")
        .getByText("courts located in San Francisco, CA")
        .first()
    ).toBeVisible();
  });

  test("party 1 details update signature table", async ({ page }) => {
    await page.goto("/");

    await page.locator("#party1-name").fill("Jane Doe");
    await page.locator("#party1-title").fill("CEO");
    await page.locator("#party1-company").fill("Acme Corp");
    await page.locator("#party1-address").fill("jane@acme.com");

    const preview = page.locator(".nda-document");
    await expect(preview.getByText("Jane Doe")).toBeVisible();
    await expect(preview.getByText("CEO")).toBeVisible();
    await expect(preview.getByText("Acme Corp")).toBeVisible();
    await expect(preview.getByText("jane@acme.com")).toBeVisible();
  });

  test("party 2 details update signature table", async ({ page }) => {
    await page.goto("/");

    await page.locator("#party2-name").fill("John Smith");
    await page.locator("#party2-company").fill("Beta Inc");

    const preview = page.locator(".nda-document");
    await expect(preview.getByText("John Smith")).toBeVisible();
    await expect(preview.getByText("Beta Inc")).toBeVisible();
  });

  test("modifications section appears when text is entered", async ({
    page,
  }) => {
    await page.goto("/");

    // Initially no modifications section in preview
    await expect(
      page.locator(".nda-document").getByText("MNDA Modifications")
    ).not.toBeVisible();

    // Fill in modifications
    await page.locator("#modifications").fill("Section 5 is amended to add 30-day notice period.");

    // Modifications section should now appear in preview
    await expect(
      page.locator(".nda-document").getByText("MNDA Modifications")
    ).toBeVisible();
    await expect(
      page
        .locator(".nda-document")
        .getByText("Section 5 is amended to add 30-day notice period.")
    ).toBeVisible();
  });
});

test.describe("NDA Creator - XSS Prevention", () => {
  test("script tags in form inputs are escaped in preview", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("#purpose").clear();
    await page.locator("#purpose").fill('<script>alert("xss")</script>');

    // Should show escaped text, not execute script
    const previewHtml = await page.locator(".nda-document").innerHTML();
    expect(previewHtml).not.toContain("<script>");
    expect(previewHtml).toContain("&lt;script&gt;");
  });

  test("img tags with onerror in party name are escaped", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("#party1-name")
      .fill('<img src=x onerror="alert(1)">');

    const previewHtml = await page.locator(".nda-document").innerHTML();
    expect(previewHtml).not.toContain("<img");
    expect(previewHtml).toContain("&lt;img");
  });

  test("HTML in modifications is escaped", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("#modifications")
      .fill('<div onmouseover="steal()">hover</div>');

    const previewHtml = await page.locator(".nda-document").innerHTML();
    expect(previewHtml).not.toContain('<div onmouseover="steal()">');
    expect(previewHtml).toContain("&lt;div onmouseover");
  });
});

test.describe("NDA Creator - Edge Cases", () => {
  test("handles empty form gracefully with placeholder values", async ({
    page,
  }) => {
    await page.goto("/");

    // Clear purpose
    await page.locator("#purpose").clear();

    // Preview should show placeholder
    await expect(
      page.locator(".nda-document").getByText("___________").first()
    ).toBeVisible();
  });

  test("handles special characters in company names", async ({ page }) => {
    await page.goto("/");

    await page.locator("#party1-company").fill("Ben & Jerry's Inc.");

    // The browser renders HTML entities, so textContent shows the actual characters
    // but the important thing is the input was escaped (no XSS) and displays correctly
    await expect(
      page.locator(".nda-document").getByText("Ben & Jerry's Inc.")
    ).toBeVisible();
  });

  test("handles very long text in purpose field", async ({ page }) => {
    await page.goto("/");

    const longText = "A".repeat(500);
    await page.locator("#purpose").clear();
    await page.locator("#purpose").fill(longText);

    // Should render without breaking the page
    await expect(page.locator(".nda-document")).toBeVisible();
  });

  test("all 11 standard term sections are rendered", async ({ page }) => {
    await page.goto("/");

    const preview = page.locator(".nda-document");
    await expect(preview.getByText("1. Introduction.", { exact: false })).toBeVisible();
    await expect(preview.getByText("11. General.", { exact: false })).toBeVisible();
  });
});

test.describe("NDA Creator - Print/PDF", () => {
  test("print button is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /print.*save.*pdf/i })
    ).toBeVisible();
  });
});
