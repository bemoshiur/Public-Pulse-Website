import type { ReactNode } from "react";

// 40–60 word quotable answer rendered at the top of content pages.
// Selector ".answer-block" is referenced by Article schema's `speakable` field.
// Lead with the answer; no fluff. See docs/SEO-AEO-GEO.md for the contract.

type AnswerBlockProps = {
  /** The literal question this block answers — optional but helps QAPage schema. */
  question?: string;
  children: ReactNode;
};

export function AnswerBlock({ question, children }: AnswerBlockProps) {
  // The question heading lives in the visual panel but OUTSIDE `.answer-block`:
  // the answer element is what speakable points at and what audits word-count,
  // and the contract (docs/SEO-AEO-GEO.md) is a 40-60 word ANSWER, not answer + question.
  return (
    <section
      className="answer-panel my-6"
      aria-labelledby={question ? "answer-question" : undefined}
    >
      {question ? (
        <h2
          id="answer-question"
          className="text-sm font-semibold uppercase tracking-wide text-brand-teal mb-2"
        >
          {question}
        </h2>
      ) : null}
      <div
        className="answer-block text-[17px] leading-relaxed text-slate-800"
        data-speakable=""
      >
        {children}
      </div>
    </section>
  );
}
