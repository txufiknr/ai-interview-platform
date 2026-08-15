import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BlindModeToggle from "@/components/portfolio/BlindModeToggle";
import ConsentBanner from "@/components/interview/ConsentBanner";
import AssessmentStatusBadge from "@/components/portfolio/AssessmentStatusBadge";
import EvaluationSummaryPanel from "@/components/portfolio/EvaluationSummaryPanel";
import type { EvaluationSkillSummary, EvaluationSummary } from "@/types";

describe("BlindModeToggle", () => {
  it("toggles and reflects the current state", () => {
    const onToggle = vi.fn();
    const { rerender } = render(<BlindModeToggle blind={false} onToggle={onToggle} />);
    expect(screen.getByRole("button")).toHaveTextContent("Blind mode");

    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledWith(true);

    rerender(<BlindModeToggle blind={true} onToggle={onToggle} />);
    expect(screen.getByRole("button")).toHaveTextContent("Blind mode ON");
  });
});

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

describe("AssessmentStatusBadge", () => {
  it("shows the derived status label", () => {
    const skill: EvaluationSkillSummary = {
      id: 1,
      skill_label: "React",
      is_discovered: false,
      assessment_status: "not_assessed",
      evidence: [],
      counter_evidence: [],
    };
    render(<AssessmentStatusBadge skill={skill} />);
    expect(screen.getByText("Not assessed")).toBeInTheDocument();
  });
});

describe("EvaluationSummaryPanel", () => {
  const ready: EvaluationSummary = {
    overall_status: "ready_for_review",
    coverage: { assessed: 3, total: 3, percent: 100 },
    needs_review: false,
    review_reasons: [],
    skills: [],
  };

  const needsReview: EvaluationSummary = {
    overall_status: "needs_review",
    coverage: { assessed: 1, total: 3, percent: 33 },
    needs_review: true,
    review_reasons: ['"System Design" could not be assessed from the available responses'],
    skills: [],
  };

  it("renders ready-for-review state", () => {
    render(<EvaluationSummaryPanel summary={ready} />);
    expect(screen.getByText("Ready for review")).toBeInTheDocument();
    expect(screen.getByText("3 of 3 competencies sufficiently assessed")).toBeInTheDocument();
  });

  it("renders needs-review state with reasons", () => {
    render(<EvaluationSummaryPanel summary={needsReview} />);
    expect(screen.getByText("Needs human review")).toBeInTheDocument();
    expect(screen.getByText(/System Design.*could not be assessed/i)).toBeInTheDocument();
  });

  it("renders nothing when summary is absent", () => {
    const { container } = render(<EvaluationSummaryPanel summary={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});