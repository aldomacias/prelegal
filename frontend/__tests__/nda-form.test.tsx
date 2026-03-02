import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NdaForm } from "@/components/nda-form";
import { createDefaultFormData, NdaFormData } from "@/lib/nda-types";

function renderForm(overrides: Partial<NdaFormData> = {}) {
  const data = { ...createDefaultFormData(), ...overrides };
  const onChange = jest.fn();
  const result = render(<NdaForm data={data} onChange={onChange} />);
  return { data, onChange, ...result };
}

describe("NdaForm", () => {
  describe("rendering", () => {
    it("renders all section headings", () => {
      renderForm();

      expect(screen.getByText("Agreement Details")).toBeInTheDocument();
      expect(screen.getByText("MNDA Term")).toBeInTheDocument();
      expect(screen.getByText("Term of Confidentiality")).toBeInTheDocument();
      expect(
        screen.getByText("Governing Law & Jurisdiction")
      ).toBeInTheDocument();
      expect(screen.getByText("Modifications")).toBeInTheDocument();
      expect(screen.getByText("Party 1")).toBeInTheDocument();
      expect(screen.getByText("Party 2")).toBeInTheDocument();
    });

    it("renders purpose input with default value", () => {
      renderForm();
      const input = screen.getByLabelText("Purpose") as HTMLInputElement;
      expect(input.value).toContain("Evaluating");
    });

    it("renders effective date input", () => {
      renderForm();
      expect(screen.getByLabelText("Effective Date")).toBeInTheDocument();
    });

    it("renders governing law select", () => {
      renderForm();
      expect(screen.getByLabelText("Governing Law (State)")).toBeInTheDocument();
    });

    it("renders jurisdiction input", () => {
      renderForm();
      expect(screen.getByLabelText("Jurisdiction")).toBeInTheDocument();
    });

    it("renders party 1 and party 2 fields", () => {
      renderForm();
      const nameInputs = screen.getAllByLabelText("Name");
      expect(nameInputs).toHaveLength(2);
      const titleInputs = screen.getAllByLabelText("Title");
      expect(titleInputs).toHaveLength(2);
      const companyInputs = screen.getAllByLabelText("Company");
      expect(companyInputs).toHaveLength(2);
      const addressInputs = screen.getAllByLabelText("Notice Address");
      expect(addressInputs).toHaveLength(2);
    });

    it("renders modifications input", () => {
      renderForm();
      expect(
        screen.getByLabelText("MNDA Modifications (optional)")
      ).toBeInTheDocument();
    });
  });

  describe("MNDA term radio", () => {
    it("shows duration input when expires is selected", () => {
      renderForm({ mndaTermType: "expires" });
      expect(document.getElementById("mndaTermDuration")).toBeInTheDocument();
    });

    it("hides MNDA duration input when until_terminated is selected", () => {
      renderForm({
        mndaTermType: "until_terminated",
        confidentialityTermType: "perpetuity",
      });
      expect(screen.queryByLabelText("Duration")).not.toBeInTheDocument();
    });

    it("renders radio options for MNDA term", () => {
      renderForm();
      expect(
        screen.getByLabelText("Expires after a set period")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Continues until terminated")
      ).toBeInTheDocument();
    });
  });

  describe("confidentiality term radio", () => {
    it("shows duration input when fixed is selected", () => {
      renderForm({
        mndaTermType: "until_terminated",
        confidentialityTermType: "fixed",
      });
      expect(screen.getByLabelText("Duration")).toBeInTheDocument();
    });

    it("hides all duration inputs when both are non-expiring", () => {
      renderForm({
        mndaTermType: "until_terminated",
        confidentialityTermType: "perpetuity",
      });
      expect(screen.queryByLabelText("Duration")).not.toBeInTheDocument();
    });

    it("renders radio options for confidentiality term", () => {
      renderForm();
      expect(screen.getByLabelText("Fixed period")).toBeInTheDocument();
      expect(screen.getByLabelText("In perpetuity")).toBeInTheDocument();
    });
  });

  describe("onChange callbacks", () => {
    it("calls onChange when purpose is updated", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const input = screen.getByLabelText("Purpose");
      await user.clear(input);
      await user.type(input, "N");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.purpose).toContain("N");
    });

    it("calls onChange when jurisdiction is updated", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const input = screen.getByLabelText("Jurisdiction");
      await user.type(input, "X");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.jurisdiction).toBe("X");
    });

    it("calls onChange when party 1 name is updated", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const nameInputs = screen.getAllByLabelText("Name");
      await user.type(nameInputs[0], "J");

      expect(onChange).toHaveBeenCalled();
      // Since the form is controlled and onChange is mocked (doesn't re-render),
      // each keystroke appends to original empty value
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party1.name).toBe("J");
    });

    it("calls onChange when party 2 company is updated", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const companyInputs = screen.getAllByLabelText("Company");
      await user.type(companyInputs[1], "X");

      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party2.company).toBe("X");
    });

    it("calls onChange with correct structure on modifications update", async () => {
      const user = userEvent.setup();
      const { onChange } = renderForm();

      const input = screen.getByLabelText("MNDA Modifications (optional)");
      await user.type(input, "A");

      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.modifications).toBe("A");
      // Verify the rest of the form data is preserved
      expect(lastCall.purpose).toBeDefined();
      expect(lastCall.party1).toBeDefined();
      expect(lastCall.party2).toBeDefined();
    });
  });

  describe("form label associations", () => {
    it("has proper htmlFor/id associations for party 1 fields", () => {
      renderForm();
      expect(document.getElementById("party1-name")).toBeInTheDocument();
      expect(document.getElementById("party1-title")).toBeInTheDocument();
      expect(document.getElementById("party1-company")).toBeInTheDocument();
      expect(document.getElementById("party1-address")).toBeInTheDocument();
    });

    it("has proper htmlFor/id associations for party 2 fields", () => {
      renderForm();
      expect(document.getElementById("party2-name")).toBeInTheDocument();
      expect(document.getElementById("party2-title")).toBeInTheDocument();
      expect(document.getElementById("party2-company")).toBeInTheDocument();
      expect(document.getElementById("party2-address")).toBeInTheDocument();
    });

    it("has proper id for purpose input", () => {
      renderForm();
      expect(document.getElementById("purpose")).toBeInTheDocument();
    });

    it("has proper id for effectiveDate input", () => {
      renderForm();
      expect(document.getElementById("effectiveDate")).toBeInTheDocument();
    });
  });

  describe("displays provided values", () => {
    it("shows party 1 values when provided", () => {
      renderForm({
        party1: {
          name: "Alice",
          title: "CEO",
          company: "Acme",
          noticeAddress: "alice@acme.com",
        },
      });

      const nameInputs = screen.getAllByLabelText("Name");
      expect((nameInputs[0] as HTMLInputElement).value).toBe("Alice");

      const titleInputs = screen.getAllByLabelText("Title");
      expect((titleInputs[0] as HTMLInputElement).value).toBe("CEO");
    });

    it("shows MNDA term duration when provided", () => {
      renderForm({ mndaTermType: "expires", mndaTermDuration: "3 years" });
      const input = document.getElementById("mndaTermDuration") as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("3 years");
    });
  });
});
