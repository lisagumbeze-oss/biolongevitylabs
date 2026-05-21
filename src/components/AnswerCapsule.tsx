import React from "react";

interface AnswerCapsuleProps {
  children: React.ReactNode;
  className?: string;
}

/** GEO answer block — 40–60 word direct answer for AI/snippet eligibility */
export default function AnswerCapsule({ children, className = "" }: AnswerCapsuleProps) {
  return (
    <section
      id="answer"
      aria-label="Quick Answer"
      className={`rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 ${className}`}
    >
      <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Quick Answer</p>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">{children}</p>
    </section>
  );
}
