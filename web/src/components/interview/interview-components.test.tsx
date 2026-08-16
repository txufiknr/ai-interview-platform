import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConsentBanner from "./ConsentBanner";
import PrepHub from "./PrepHub";

describe("ConsentBanner", () => {
  it("allows consent and notifies the caller", () => {
    const onConsentChange = vi.fn();
    render(<ConsentBanner onConsentChange={onConsentChange} />);

    fireEvent.click(screen.getByRole("button", { name: /I consent to AI processing/i }));
    expect(onConsentChange).toHaveBeenCalledWith(true);
    expect(screen.getByText(/may withdraw consent/i)).toBeInTheDocument();
  });

  it("allows declining AI processing", () => {
    const onConsentChange = vi.fn();
    render(<ConsentBanner onConsentChange={onConsentChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Decline AI processing/i }));
    expect(onConsentChange).toHaveBeenCalledWith(false);
    expect(screen.getByText(/human assessor will review/i)).toBeInTheDocument();
  });

  it("renders the UU PDP notice copy", () => {
    render(<ConsentBanner />);
    expect(screen.getByText(/Personal Data Protection Law/i)).toBeInTheDocument();
  });
});

describe("PrepHub", () => {
  it("shows role title and skill areas", () => {
    render(
      <PrepHub roleTitle="Product Manager" timeLimitMin={45} skillAreas={["Strategy", "Execution"]} />
    );

    expect(screen.getByText(/Product Manager/)).toBeInTheDocument();
    expect(screen.getByText("Strategy")).toBeInTheDocument();
    expect(screen.getByText("Execution")).toBeInTheDocument();
  });

  it("reveals practice questions on click", () => {
    render(<PrepHub roleTitle="Role" timeLimitMin={30} skillAreas={[]} />);

    const trigger = screen.getByRole("button", { name: /practice/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/recent project you're proud of/)).toBeInTheDocument();
    expect(screen.getByText(/not recorded or scored/)).toBeInTheDocument();
  });
});
