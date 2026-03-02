import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NdaPreview } from "@/components/nda-preview";
import { createDefaultFormData, NdaFormData } from "@/lib/nda-types";

function makeFormData(overrides: Partial<NdaFormData> = {}): NdaFormData {
  return { ...createDefaultFormData(), ...overrides };
}

describe("NdaPreview", () => {
  describe("rendering", () => {
    it("renders Document Preview heading", () => {
      render(<NdaPreview data={makeFormData()} />);
      expect(screen.getByText("Document Preview")).toBeInTheDocument();
    });

    it("renders Print / Save as PDF button", () => {
      render(<NdaPreview data={makeFormData()} />);
      expect(
        screen.getByRole("button", { name: /print.*save.*pdf/i })
      ).toBeInTheDocument();
    });

    it("renders cover page content", () => {
      render(
        <NdaPreview
          data={makeFormData({
            purpose: "Test collaboration review.",
          })}
        />
      );
      expect(
        screen.getByText("Mutual Non-Disclosure Agreement")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Test collaboration review.")
      ).toBeInTheDocument();
    });

    it("renders standard terms", () => {
      render(<NdaPreview data={makeFormData()} />);
      expect(screen.getByText("1. Introduction.", { exact: false })).toBeInTheDocument();
    });

    it("renders party details in signature table", () => {
      render(
        <NdaPreview
          data={makeFormData({
            party1: {
              name: "Test Person",
              title: "VP",
              company: "TestCorp",
              noticeAddress: "test@corp.com",
            },
          })}
        />
      );
      expect(screen.getByText("Test Person")).toBeInTheDocument();
      expect(screen.getByText("TestCorp")).toBeInTheDocument();
    });

    it("updates when data changes", () => {
      const { rerender } = render(
        <NdaPreview data={makeFormData({ governingLaw: "Texas" })} />
      );
      expect(screen.getAllByText(/Texas/).length).toBeGreaterThanOrEqual(1);

      rerender(
        <NdaPreview data={makeFormData({ governingLaw: "Florida" })} />
      );
      expect(screen.getAllByText(/Florida/).length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText(/Texas/)).not.toBeInTheDocument();
    });
  });

  describe("XSS prevention in preview", () => {
    it("does not render script tags from user input", () => {
      const { container } = render(
        <NdaPreview
          data={makeFormData({
            purpose: '<script>alert("xss")</script>',
          })}
        />
      );
      expect(container.querySelector("script")).toBeNull();
      expect(container.innerHTML).toContain("&lt;script&gt;");
    });

    it("does not render img tags with onerror from user input", () => {
      const { container } = render(
        <NdaPreview
          data={makeFormData({
            party1: {
              name: '<img src=x onerror="alert(1)">',
              title: "",
              company: "",
              noticeAddress: "",
            },
          })}
        />
      );
      expect(container.querySelector("img[onerror]")).toBeNull();
    });
  });

  describe("print functionality", () => {
    it("shows alert when popup is blocked", async () => {
      const user = userEvent.setup();
      const originalOpen = window.open;
      window.open = jest.fn().mockReturnValue(null);
      window.alert = jest.fn();

      render(<NdaPreview data={makeFormData()} />);
      const button = screen.getByRole("button", { name: /print.*save.*pdf/i });
      await user.click(button);

      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("pop-ups")
      );

      window.open = originalOpen;
    });

    it("opens print window and writes document content", async () => {
      const user = userEvent.setup();
      const mockWrite = jest.fn();
      const mockClose = jest.fn();
      const mockPrint = jest.fn();

      const mockWindow = {
        document: { write: mockWrite, close: mockClose },
        print: mockPrint,
        onload: null as (() => void) | null,
        onafterprint: null as (() => void) | null,
      };

      const originalOpen = window.open;
      window.open = jest.fn().mockReturnValue(mockWindow);

      render(<NdaPreview data={makeFormData({ purpose: "Test purpose" })} />);
      const button = screen.getByRole("button", { name: /print.*save.*pdf/i });
      await user.click(button);

      expect(window.open).toHaveBeenCalledWith("", "_blank");
      expect(mockWrite).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();

      // The written HTML should contain the document content
      const writtenContent = mockWrite.mock.calls[0][0];
      expect(writtenContent).toContain("Mutual NDA");
      expect(writtenContent).toContain("<style>");

      window.open = originalOpen;
    });
  });
});
