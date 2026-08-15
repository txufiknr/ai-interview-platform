import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TrustContextPanel from "./TrustContextPanel";
import PrepHub from "@/components/interview/PrepHub";
import type { IntegrityMetadata } from "@/types";

describe("TrustContextPanel", () => {
  it("shows a fallback when no integrity signals were recorded", () => {
    render(<TrustContextPanel />);
    expect(screen.getByText("No integrity signals recorded")).toBeInTheDocument();
  });

  it("renders integrity signals when present", () => {
    const integrity: IntegrityMetadata = {
      device_state: "mic ok, camera passed",
      connection_health: "stable",
      reconnect_events: 0,
    };

    render(<TrustContextPanel integrity={integrity} durationSeconds={125} endReason="all_covered" />);

    expect(screen.getByText("2m 5s")).toBeInTheDocument();
    expect(screen.getByText("all covered")).toBeInTheDocument();
    expect(screen.getByText("mic ok, camera passed")).toBeInTheDocument();
    expect(screen.getByText("None — stable throughout")).toBeInTheDocument();
  });

  it("reports reconnect counts honestly", () => {
    render(<TrustContextPanel integrity={{ reconnect_events: 3 }} />);
    expect(screen.getByText("3 event(s)")).toBeInTheDocument();
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