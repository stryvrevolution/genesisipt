'use client';

import { useState, ReactNode } from 'react';

interface AccordionItemProps {
  question: string;
  answer: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.25)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-0 text-left flex justify-between items-center gap-4 hover:text-[#19D4FF] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-light text-white pr-8 text-left">{question}</span>
        <span className={`text-sm text-white/60 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-white/70 leading-relaxed text-sm font-extralight">
          {answer}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: Array<{ question: string; answer: ReactNode }>;
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}




