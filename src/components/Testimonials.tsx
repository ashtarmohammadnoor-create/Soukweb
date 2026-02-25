type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

type Props = {
  items: Testimonial[];
};

export function Testimonials({items}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-base leading-8 text-slate-700">&ldquo;{item.quote}&rdquo;</p>
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-500">{item.role}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
