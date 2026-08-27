import { useMemo, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowRight, Check, CircleCheck, Clock3, Info, Mail, MapPin, Menu, Minus, Phone, Plus, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { getGetPricingQueryKey, getHealthCheckQueryKey, useGetPricing, useHealthCheck, useRequestSample } from '@workspace/api-client-react';
import type { LegacySampleRequestInput } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing desk', href: '#pricing' },
  { label: 'Sample run', href: '#sample' },
];

function BrandMark() {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
      <span className="flex h-9 w-9 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]" aria-hidden="true">
        <span className="h-4 w-4 rotate-45 border-2 border-[hsl(var(--foreground))]" />
      </span>
      <span className="leading-none">
        <span className="block text-[15px] font-bold tracking-tight">MITMIT</span>
        <span className="mono-font mt-1 block text-[9px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">Wholesale injera</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <BrandMark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href} className="nav-link text-sm font-medium text-[hsl(var(--foreground)/.7)]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              {item.label}
            </a>
          ))}
          <a href="#sample" className="group flex items-center gap-2 bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition hover:bg-[hsl(var(--secondary))]" data-testid="link-header-sample">
            Request a sample <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </nav>
        <button type="button" className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a href={item.href} onClick={() => setOpen(false)} key={item.href} className="text-sm font-semibold" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>
            ))}
            <a href="#sample" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--secondary))]" data-testid="link-mobile-sample">Request a sample <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[hsl(var(--background))]">
      <Header />
      <div className="mx-auto grid min-h-[700px] max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="hero-enter relative z-10 max-w-2xl">
          <div className="eyebrow mb-7 flex items-center gap-3 text-[hsl(var(--secondary))]">
            <span className="h-px w-8 bg-[hsl(var(--secondary))]" /> Addis Ababa · established for the service line
          </div>
          <h1 className="display-font max-w-xl text-[clamp(3.6rem,8vw,7.8rem)] font-bold leading-[.88] tracking-[-.06em] text-[hsl(var(--foreground))]">
            Soft food.<br /><span className="text-[hsl(var(--secondary))]">Solid supply.</span>
          </h1>
          <p className="hero-enter-delay mt-8 max-w-lg text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">
            Fresh injera for the places that feed Addis — made to your rhythm, packed for the road, and delivered when your kitchen expects it.
          </p>
          <div className="hero-enter-late mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href="#pricing" className="group flex items-center gap-3 bg-[hsl(var(--secondary))] px-6 py-4 font-semibold text-[hsl(var(--secondary-foreground))] transition hover:bg-[hsl(var(--primary))]" data-testid="link-hero-pricing">
              Build an order <ArrowDownRight className="h-4 w-4 transition group-hover:translate-y-1 group-hover:translate-x-1" />
            </a>
            <a href="#how-it-works" className="flex items-center gap-2 text-sm font-semibold underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4" data-testid="link-hero-process">
              See the service <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[hsl(var(--secondary))]" /> Food-safe packing</span>
            <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[hsl(var(--secondary))]" /> Predictable routes</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[hsl(var(--secondary))]" /> Addis-wide delivery</span>
          </div>
        </div>
        <div className="relative hero-enter-delay lg:justify-self-end">
          <div className="absolute -right-10 -top-12 hidden h-36 w-36 border border-[hsl(var(--accent)/.6)] sm:block" />
          <div className="absolute -bottom-10 -left-9 z-10 hidden w-48 bg-[hsl(var(--accent))] p-5 sm:block float-slow">
            <div className="eyebrow text-[hsl(var(--foreground))]">Dispatch note</div>
            <p className="display-font mt-2 text-2xl font-bold leading-tight">Made fresh.<br />Moved fast.</p>
          </div>
          <div className="relative aspect-[.83] w-full max-w-[490px] overflow-hidden bg-[hsl(var(--primary))]">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(39 92% 55% / .45) 0 1px, transparent 1px)', backgroundSize: '13px 13px' }} />
            <div className="absolute inset-6 border border-[hsl(var(--accent)/.5)]" />
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
              <div className="relative h-[68%] w-[74%] rotate-[-7deg] rounded-[50%] border-[18px] border-[hsl(var(--accent))] bg-[hsl(39 70% 77%)] shadow-[18px_20px_0_hsl(11_63%_51%/.55)]">
                <div className="absolute inset-[10%] rounded-[50%] border border-[hsl(11_63%_51%/.4)]" />
                <div className="absolute inset-[18%] rounded-[50%] border border-[hsl(11_63%_51%/.3)]" />
                <div className="absolute left-[35%] top-[45%] h-3 w-3 rounded-full bg-[hsl(11_63%_51%/.35)]" />
                <div className="absolute left-[58%] top-[33%] h-2 w-2 rounded-full bg-[hsl(11_63%_51%/.3)]" />
                <div className="absolute left-[22%] top-[60%] h-2 w-2 rounded-full bg-[hsl(11_63%_51%/.25)]" />
              </div>
            </div>
            <div className="eyebrow absolute bottom-7 left-7 text-[hsl(var(--background))]">Batch no. 042 / መረጃ</div>
          </div>
        </div>
      </div>
      <div className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card)/.65)] py-3.5">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap text-[11px] font-medium uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
          {[1, 2].map((group) => <span key={group} className="flex items-center gap-10"><span>For the people who set the table</span><span className="text-[hsl(var(--accent))]">◆</span><span>Teff-forward · route-ready · dependable</span><span className="text-[hsl(var(--accent))]">◆</span></span>)}
        </div>
      </div>
    </section>
  );
}

function ServiceStrip() {
  const items = [
    { number: '01', title: 'Choose your rhythm', body: 'Tell us the quantities and delivery cadence your kitchen actually runs on.' },
    { number: '02', title: 'We make to plan', body: 'Your order joins a production route built around freshness, not guesswork.' },
    { number: '03', title: 'You serve with ease', body: 'Packed, counted, and at your door — ready for the first table.' },
  ];
  return (
    <section id="how-it-works" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-[hsl(var(--sidebar-accent))] px-5 sm:px-8 md:grid-cols-3 lg:px-12">
        {items.map((item) => (
          <div className="bg-[hsl(var(--primary))] px-0 py-12 md:min-h-[236px] md:px-8 md:py-14 first:md:pl-0" key={item.number}>
            <div className="eyebrow text-[hsl(var(--accent))]">{item.number}</div>
            <h2 className="display-font mt-7 text-3xl font-bold">{item.title}</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.65)]">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingDesk() {
  const [type, setType] = useState<'white' | 'red'>('white');
  const [qty, setQty] = useState(48);
  const params = useMemo(() => ({ qty, type }), [qty, type]);
  const pricingQuery = useGetPricing(params, { query: { queryKey: getGetPricingQueryKey(params), staleTime: 30000 } });
  const pricing = pricingQuery.data;

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24">
        <div>
          <div className="eyebrow flex items-center gap-3 text-[hsl(var(--secondary))]"><span className="h-px w-8 bg-[hsl(var(--secondary))]" /> Price it properly</div>
          <h2 className="display-font mt-6 max-w-md text-5xl font-bold leading-[.98] tracking-[-.04em] sm:text-6xl">Your next service starts with a number.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-[hsl(var(--muted-foreground))]">Use the live wholesale desk to price a real order. Volume earns its keep — the more your kitchen moves, the more it saves.</p>
          <div className="mt-12 border-l-2 border-[hsl(var(--accent))] pl-5">
            <p className="text-sm font-semibold">Pricing shown in Ethiopian birr.</p>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Final delivery timing is confirmed with your route coordinator.</p>
          </div>
        </div>
        <div className="paper-card overflow-hidden">
          <div className="flex flex-col justify-between gap-5 border-b border-[hsl(var(--border))] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <div className="eyebrow text-[hsl(var(--secondary))]">Live calculator</div>
              <h3 className="mt-2 text-xl font-bold">Build a wholesale basket</h3>
            </div>
            <div className="flex border border-[hsl(var(--border))] p-1" role="group" aria-label="Teff variety">
              {(['white', 'red'] as const).map((option) => (
                <button type="button" key={option} onClick={() => setType(option)} className={`px-4 py-2 text-xs font-bold uppercase tracking-[.1em] transition ${type === option ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`} data-testid={`button-type-${option}`}>
                  {option} teff
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1fr]">
            <div>
              <label htmlFor="quantity" className="eyebrow text-[hsl(var(--muted-foreground))]">Quantity / pieces</label>
              <div className="mt-3 flex h-14 items-center border border-[hsl(var(--input))] bg-[hsl(var(--background))]">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 12))} className="flex h-full w-14 items-center justify-center text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]" aria-label="Decrease quantity" data-testid="button-quantity-decrease"><Minus className="h-4 w-4" /></button>
                <input id="quantity" type="number" min="1" value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} className="h-full min-w-0 flex-1 border-x border-[hsl(var(--input))] bg-transparent px-3 text-center text-lg font-bold outline-none" data-testid="input-pricing-quantity" />
                <button type="button" onClick={() => setQty(qty + 12)} className="flex h-full w-14 items-center justify-center text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]" aria-label="Increase quantity" data-testid="button-quantity-increase"><Plus className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[48, 96, 240].map((preset) => <button type="button" key={preset} onClick={() => setQty(preset)} className={`border px-3 py-1.5 text-xs transition ${qty === preset ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/.08)] text-[hsl(var(--secondary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--secondary))]'}`} data-testid={`button-preset-${preset}`}>{preset} pcs</button>)}
              </div>
            </div>
            <div className="flex min-h-[184px] flex-col justify-between bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]">
              <div className="flex items-start justify-between">
                <span className="eyebrow text-[hsl(var(--accent))]">Order estimate</span>
                <span className="mono-font text-xs text-[hsl(var(--primary-foreground)/.55)]">{type.toUpperCase()} / {qty}</span>
              </div>
              {pricingQuery.isLoading ? (
                <div className="space-y-3" data-testid="status-pricing-loading"><div className="h-10 w-44 animate-pulse bg-[hsl(var(--primary-foreground)/.15)]" /><div className="h-3 w-32 animate-pulse bg-[hsl(var(--primary-foreground)/.15)]" /></div>
              ) : pricingQuery.isError ? (
                <div data-testid="status-pricing-error"><p className="text-sm text-[hsl(var(--primary-foreground)/.75)]">The pricing desk is taking a pause.</p><button type="button" onClick={() => pricingQuery.refetch()} className="mt-3 flex items-center gap-2 text-xs font-semibold text-[hsl(var(--accent))]" data-testid="button-pricing-retry"><RefreshCw className="h-3.5 w-3.5" /> Try again</button></div>
              ) : pricing ? (
                <div data-testid="value-pricing-total"><div className="display-font text-5xl font-bold tracking-[-.04em]">{pricing.currency} {pricing.total.toLocaleString()}</div><div className="mt-2 flex items-center gap-2 text-sm text-[hsl(var(--accent))]"><CircleCheck className="h-4 w-4" /> Save {pricing.currency} {pricing.savings.toLocaleString()} ({pricing.discountPercent}%)</div></div>
              ) : <p className="text-sm text-[hsl(var(--primary-foreground)/.7)]">Enter your usual order size to see the live estimate.</p>}
            </div>
          </div>
          {pricing && !pricingQuery.isLoading && (
            <div className="grid grid-cols-2 border-t border-[hsl(var(--border))] sm:grid-cols-4" data-testid="pricing-breakdown">
              <div className="border-r border-[hsl(var(--border))] p-5"><div className="eyebrow text-[hsl(var(--muted-foreground))]">Unit price</div><div className="mt-2 font-bold">{pricing.currency} {pricing.unitPrice.toFixed(2)}</div></div>
              <div className="border-b border-[hsl(var(--border))] p-5 sm:border-r"><div className="eyebrow text-[hsl(var(--muted-foreground))]">List price</div><div className="mt-2 font-bold">{pricing.currency} {pricing.baseUnitPrice.toFixed(2)}</div></div>
              <div className="border-r border-[hsl(var(--border))] p-5"><div className="eyebrow text-[hsl(var(--muted-foreground))]">Quantity</div><div className="mt-2 font-bold">{pricing.qty} pcs</div></div>
              <div className="p-5"><div className="eyebrow text-[hsl(var(--muted-foreground))]">Variety</div><div className="mt-2 font-bold">{pricing.label}</div></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SampleForm() {
  const requestSample = useRequestSample();
  const [form, setForm] = useState<LegacySampleRequestInput>({ name: '', business: '', email: '', phone: '', quantity: 24, message: '' });
  const [submitted, setSubmitted] = useState<{ id: string; status: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (key: keyof LegacySampleRequestInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please add your full name.';
    if (form.business.trim().length < 2) next.business = 'Please add your business name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Use a working email address.';
    if (form.phone.trim().length < 7) next.phone = 'Please add a reachable phone number.';
    if (form.quantity < 1) next.quantity = 'Choose at least one piece.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    requestSample.mutate({ data: form }, { onSuccess: (result) => setSubmitted({ id: result.id, status: result.status }) });
  };

  if (submitted) {
    return (
      <div className="paper-card flex min-h-[520px] flex-col items-center justify-center p-8 text-center sm:p-14" data-testid="status-sample-success">
        <div className="flex h-16 w-16 items-center justify-center bg-[hsl(var(--accent))]"><Check className="h-7 w-7" /></div>
        <div className="eyebrow mt-8 text-[hsl(var(--secondary))]">Request received · {submitted.status}</div>
        <h3 className="display-font mt-4 text-4xl font-bold">We’ll bring the first batch.</h3>
        <p className="mt-4 max-w-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A route coordinator will reach out shortly to confirm your sample and the best delivery window.</p>
        <div className="mono-font mt-8 border border-[hsl(var(--border))] px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">REFERENCE / {submitted.id}</div>
        <button type="button" onClick={() => { setSubmitted(null); setForm({ name: '', business: '', email: '', phone: '', quantity: 24, message: '' }); }} className="mt-8 text-sm font-semibold underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4" data-testid="button-submit-another">Submit another request</button>
      </div>
    );
  }
  const inputClass = (key: string) => `mt-2 w-full border bg-[hsl(var(--background))] px-4 py-3.5 text-sm outline-none transition focus:border-[hsl(var(--secondary))] focus:ring-2 focus:ring-[hsl(var(--secondary)/.14)] ${errors[key] ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--input))]'}`;
  return (
    <form onSubmit={submit} className="paper-card p-6 sm:p-10" noValidate data-testid="form-sample-request">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold">Your name<input value={form.name} onChange={(event) => update('name', event.target.value)} className={inputClass('name')} placeholder="e.g. Selamawit Bekele" data-testid="input-sample-name" />{errors.name && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.name}</span>}</label>
        <label className="text-sm font-semibold">Business name<input value={form.business} onChange={(event) => update('business', event.target.value)} className={inputClass('business')} placeholder="Restaurant, hotel, catering..." data-testid="input-sample-business" />{errors.business && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.business}</span>}</label>
        <label className="text-sm font-semibold">Work email<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={inputClass('email')} placeholder="you@yourbusiness.com" data-testid="input-sample-email" />{errors.email && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.email}</span>}</label>
        <label className="text-sm font-semibold">Phone number<input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className={inputClass('phone')} placeholder="+251 9..." data-testid="input-sample-phone" />{errors.phone && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.phone}</span>}</label>
        <label className="text-sm font-semibold">Sample quantity<input type="number" min="1" value={form.quantity} onChange={(event) => update('quantity', Number(event.target.value) || 0)} className={inputClass('quantity')} data-testid="input-sample-quantity" />{errors.quantity && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.quantity}</span>}</label>
        <label className="text-sm font-semibold sm:col-span-2">What should we know? <span className="font-normal text-[hsl(var(--muted-foreground))]">Optional</span><textarea value={form.message} onChange={(event) => update('message', event.target.value)} className={`${inputClass('message')} min-h-28 resize-y`} placeholder="Usual service days, preferred variety, delivery area..." data-testid="input-sample-message" /></label>
      </div>
      {requestSample.isError && <div className="mt-6 flex items-start gap-2 border border-[hsl(var(--destructive)/.35)] bg-[hsl(var(--destructive)/.06)] p-4 text-sm text-[hsl(var(--destructive))]" data-testid="status-sample-error"><Info className="mt-0.5 h-4 w-4 shrink-0" /> We couldn’t send that request. Please check your details and try again.</div>}
      <div className="mt-8 flex flex-col justify-between gap-5 border-t border-[hsl(var(--border))] pt-6 sm:flex-row sm:items-center">
        <p className="max-w-xs text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">No commitment. Just a proper first taste and a conversation about your route.</p>
        <button type="submit" disabled={requestSample.isPending} className="group flex items-center justify-center gap-3 bg-[hsl(var(--secondary))] px-6 py-4 text-sm font-bold text-[hsl(var(--secondary-foreground))] transition hover:bg-[hsl(var(--primary))] disabled:cursor-wait disabled:opacity-65" data-testid="button-submit-sample">
          {requestSample.isPending ? 'Sending request...' : 'Request my sample'} {!requestSample.isPending && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  );
}

function SampleSection() {
  return (
    <section id="sample" className="bg-[hsl(var(--muted)/.55)] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-24 lg:px-12">
        <div>
          <div className="eyebrow flex items-center gap-3 text-[hsl(var(--secondary))]"><span className="h-px w-8 bg-[hsl(var(--secondary))]" /> Make it real</div>
          <h2 className="display-font mt-6 text-5xl font-bold leading-[.98] tracking-[-.04em] sm:text-6xl">Let the kitchen decide.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-[hsl(var(--muted-foreground))]">A sample run is the fastest way to see how Mitmit fits your menu, your service, and your delivery window.</p>
          <div className="mt-12 space-y-6">
            {['A soft, fresh batch from the current route', 'The right variety for your menu and margins', 'A human follow-up — not an automated sales pitch'].map((line) => <div className="flex items-start gap-3 text-sm" key={line}><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[hsl(var(--accent))]"><Check className="h-3.5 w-3.5" /></span><span>{line}</span></div>)}
          </div>
        </div>
        <SampleForm />
      </div>
    </section>
  );
}

function Footer() {
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), staleTime: 60000 } });
  return (
    <footer className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-12">
        <div><BrandMark /><p className="mt-6 max-w-xs text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.6)]">The dependable wholesale ordering desk for Addis food businesses.</p></div>
        <div><div className="eyebrow text-[hsl(var(--accent))]">Talk to dispatch</div><div className="mt-5 space-y-3 text-sm text-[hsl(var(--primary-foreground)/.75)]"><a href="mailto:hello@mitmit.et" className="flex items-center gap-2 hover:text-[hsl(var(--accent))]" data-testid="link-footer-email"><Mail className="h-4 w-4" /> hello@mitmit.et</a><a href="tel:+251911234567" className="flex items-center gap-2 hover:text-[hsl(var(--accent))]" data-testid="link-footer-phone"><Phone className="h-4 w-4" /> +251 911 234 567</a></div></div>
        <div><div className="eyebrow text-[hsl(var(--accent))]">Service line</div><p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.75)]"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Addis Ababa<br />Routes planned daily</p><div className="mt-5 flex items-center gap-2 text-xs text-[hsl(var(--primary-foreground)/.45)]" data-testid="status-health"><span className={`h-2 w-2 rounded-full ${health.data?.status === 'ok' ? 'bg-[hsl(var(--accent))]' : health.isLoading ? 'bg-[hsl(var(--muted-foreground))]' : 'bg-[hsl(var(--secondary))]'}`} /> {health.data?.status === 'ok' ? 'Ordering desk online' : health.isLoading ? 'Checking desk status' : 'Desk status unavailable'}</div></div>
      </div>
      <div className="border-t border-[hsl(var(--primary-foreground)/.12)]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-5 text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground)/.38)] sm:flex-row sm:px-8 lg:px-12"><span>© {new Date().getFullYear()} Mitmit Foods</span><span>Freshness you can schedule</span></div></div>
    </footer>
  );
}

function Home() {
  return <div className="grain site-shell min-h-[100dvh]"><Hero /><ServiceStrip /><PricingDesk /><SampleSection /><Footer /></div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;