type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
};

export function FAQ({items}: Props) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <span className="text-base font-semibold text-slate-900 md:text-lg">{item.question}</span>
            <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <p className="mt-3 text-base leading-8 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
