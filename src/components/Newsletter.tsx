type Props = {
  title: string;
  description: string;
  placeholder: string;
  actionLabel: string;
};

export function Newsletter({title, description, placeholder, actionLabel}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-base text-slate-600">{description}</p>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input type="email" placeholder={placeholder} className="input-field h-12 rounded-2xl text-base" />
        <button type="submit" className="btn-primary h-11 rounded-2xl px-6">
          {actionLabel}
        </button>
      </form>
    </div>
  );
}
