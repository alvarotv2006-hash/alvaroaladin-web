import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap, BadgeEuro, ShieldCheck, Terminal, Globe, CalendarDays, MessageCircle, Mail, Bot, Cloud,
  Wrench, MapPin, PenLine, Scissors, Flower2, Stethoscope, Car, UtensilsCrossed, Store,
  Check, Eye, User, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aladin & Álvaro — Tu web con IA lista en 12 a 36 horas" },
      { name: "description", content: "Webs profesionales y automatizaciones con IA para negocios de España. Pago único, sin cuotas y 1 año de garantía." },
      { property: "og:title", content: "Aladin & Álvaro — Webs con IA en 12-36h" },
      { property: "og:description", content: "Webs y automatizaciones con IA para autónomos y pymes. Sin cuotas mensuales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WA = "mailto:atvama0605@gmail.com?subject=Quiero%20informaci%C3%B3n%20para%20mi%20web";

const NAV = [
  ["Nosotros", "#nosotros"], ["Servicios", "#servicios"], ["Clientes", "#clientes"],
  ["Tarifas", "#tarifas"], ["Proceso", "#proceso"], ["FAQ", "#faq"], ["Contacto", "#contacto"],
] as const;

const HIGHLIGHTS = [
  { icon: Zap, t: "12-36h", d: "Tiempo récord garantizado desde la entrega de datos hasta el despliegue funcional." },
  { icon: BadgeEuro, t: "100% Sin Cuotas", d: "Pago único. La web y el código te pertenecen por completo, sin suscripciones forzosas." },
  { icon: ShieldCheck, t: "1 Año Garantía", d: "Soporte técnico directo sin coste adicional ante cualquier incidencia o fallo." },
  { icon: Terminal, t: "Directo con Devs", d: "Sin comerciales ni intermediarios. Hablas con Aladin y Álvaro en cada paso." },
];

const SERVICES = [
  { icon: Globe, t: "Web a medida ultra rápida", d: "Estructura moderna optimizada para móvil, sin plantillas lentas ni plugins pesados.", tag: "Rendimiento >95/100" },
  { icon: CalendarDays, t: "Sistema de reservas ágil", d: "Citas automatizadas con sincronización en Google Calendar y aviso al teléfono.", tag: "Sin overbooking" },
  { icon: MessageCircle, t: "WhatsApp e Instagram directos", d: "Botones inteligentes para abrir chats comerciales con un solo toque.", tag: "Conversión directa" },
  { icon: Bot, t: "Asistente virtual con IA 24/7", d: "Agente entrenado con tus precios, horarios y catálogo para responder de noche.", tag: "Respuesta instantánea" },
  { icon: Cloud, t: "Alojamiento en la nube", d: "Infraestructura global de alta disponibilidad, rápida en cualquier lugar.", tag: "SSL incluido" },
  { icon: Wrench, t: "Mantenimiento preventivo", d: "Revisiones periódicas de enlaces y seguridad para que tu web nunca caiga.", tag: "1 año garantía" },
  { icon: MapPin, t: "Posicionamiento SEO local", d: "Metadatos, Schema.org y mapa para destacar en las búsquedas locales de Google.", tag: "Google Maps" },
  { icon: PenLine, t: "Redacción comercial persuasiva", d: "Textos escritos por nosotros para resaltar tus fortalezas.", tag: "Copywriting completo" },
];

const SECTORS = [
  { icon: Scissors, t: "Peluquerías y Estética", d: "Agenda automática de citas sin contestar al teléfono." },
  { icon: Flower2, t: "Floristerías", d: "Catálogo de ramos y pedidos rápidos por WhatsApp." },
  { icon: Stethoscope, t: "Clínicas y Salud", d: "Gestión de turnos y formularios de pre-consulta." },
  { icon: Car, t: "Talleres Mecánicos", d: "Presupuesto aproximado con IA y petición de turno." },
  { icon: UtensilsCrossed, t: "Restaurantes", d: "Carta digital QR, reserva de mesas y pedidos para llevar." },
  { icon: Store, t: "Comercio local", d: "Escaparate online, horarios y contacto directo con clientes." },
];

const PLANS = [
  { name: "Web Exprés", price: "290", d: "Para empezar a estar en Google ya.", items: ["Web de 1 página", "Botón de WhatsApp", "SEO local básico", "Entrega en 12-24h"] },
  { name: "Web Profesional", price: "490", d: "La opción más elegida por pymes.", featured: true, items: ["Hasta 5 secciones", "Sistema de reservas", "SEO local completo", "Textos comerciales", "Entrega en 24-36h"] },
  { name: "Web + IA", price: "890", d: "Tu negocio atendiendo 24/7.", items: ["Todo lo de Profesional", "Asistente IA entrenado", "Automatización WhatsApp", "Panel de mensajes"] },
];

const STEPS = [
  ["01", "Llamada de 15 min", "Nos cuentas tu negocio y qué necesitas."],
  ["02", "Nos envías los datos", "Logo, fotos, horarios y servicios. Te guiamos."],
  ["03", "Diseño y desarrollo", "Montamos la web y las automatizaciones en tiempo récord."],
  ["04", "Publicación", "Tu web online, con dominio y lista para vender."],
] as const;

const FAQS = [
  ["¿De verdad está lista en 12-36 horas?", "Sí. El plazo empieza cuando nos envías toda la información (textos, fotos, logo). Si te falta algo, te ayudamos a prepararlo."],
  ["¿Hay cuotas mensuales?", "No. Pagas una sola vez y la web es tuya. Solo pagarías el dominio anual si quieres uno propio."],
  ["¿Puedo pedir cambios después?", "Durante el primer año corregimos cualquier fallo sin coste. Los cambios de contenido pequeños también están incluidos."],
  ["¿Trabajáis con negocios de toda España?", "Sí, trabajamos 100% en remoto. Todo se hace por videollamada, WhatsApp y email."],
  ["¿Qué hace el asistente con IA?", "Responde a tus clientes en la web o WhatsApp con tus precios, horarios y servicios, y te avisa cuando alguien quiere reservar."],
] as const;

function Index() {
  const [plan, setPlan] = useState("Web Profesional");
  const [open, setOpen] = useState(false);

  const choose = (p: string) => {
    setPlan(p);
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">A</span>
            <span className="leading-tight">
              <span className="block font-bold">Aladin & Álvaro</span>
              <span className="block font-mono text-[10px] tracking-[0.2em] text-muted-foreground">AI & WEB STUDIO</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-primary">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="hero" size="sm" className="hidden sm:inline-flex" onClick={() => choose(plan)}>Agendar Demo</Button>
            <Button asChild variant="secondary" size="icon" className="rounded-full" aria-label="Acceso administración">
              <Link to="/admin"><User /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 lg:hidden">
            {NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-2 font-medium">{l}</a>)}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-glow">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-secondary-foreground">
            <span className="size-2 animate-pulse rounded-full bg-success" /> DESPLIEGUE EXPRÉS PARA NEGOCIOS EN ESPAÑA
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            Tu página web con IA,<br /><span className="text-primary">lista en 12 a 36 horas</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Webs profesionales y automatizaciones con inteligencia artificial para cualquier negocio de España, a precios económicos. Sin cuotas mensuales ni ataduras.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl"><a href={WA} ><Mail /> Escríbenos por email</a></Button>
            <Button asChild variant="soft" size="xl"><a href="#tarifas"><Eye /> Ver tarifas</a></Button>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-xl bg-card p-6 shadow-soft">
                <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><I className="size-5" /></span>
                <h3 className="mt-5 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">01 / Quiénes somos</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">Cercanía artesanal, velocidad de software</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Somos un estudio ágil de dos personas. Fusionamos ingeniería de IA moderna con diseño web limpio, para autónomos y pymes que buscan resultados sin complicaciones.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {([
              ["Aladin", "IA & Automatizaciones", "Arquitectura de datos, agentes inteligentes en WhatsApp, modelos de lenguaje y automatización de procesos para ahorrar horas a tu negocio.", "Python • IA • Automatización • Cloud"],
              ["Álvaro", "Frontend & UI/UX", "Que tu web luzca impecable en cualquier pantalla, cargue en menos de un segundo y convierta visitas en llamadas o reservas.", "Diseño • Rendimiento • SEO • UX"],
            ] as const).map(([n, r, d, s]) => (
              <div key={n} className="flex gap-5 rounded-2xl bg-card p-7 shadow-soft">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground">{n[0]}</span>
                <div>
                  <h3 className="text-xl font-bold">{n} <span className="text-base font-medium text-primary">· {r}</span></h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">02 / Soluciones</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Todo lo necesario para vender más</h2>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground">8 MÓDULOS ACTIVOS</span>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: I, t, d, tag }) => (
              <div key={t} className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
                <I className="size-6 text-primary" />
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{d}</p>
                <p className="mt-5 font-mono text-[10px] tracking-widest text-primary uppercase">{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectores */}
      <section id="clientes" className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">03 / Negocios locales</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Diseñado para cualquier sector en España</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Trabajamos 100% en remoto: no necesitas desplazarte ni perder horas de tu jornada.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map(({ icon: I, t, d }) => (
              <div key={t} className="flex items-start gap-4 rounded-xl bg-card p-5 shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><I className="size-5" /></span>
                <div><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifas */}
      <section id="tarifas" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">04 / Tarifas</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Pago único. Sin sorpresas.</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-2xl p-8 ${p.featured ? "bg-ink text-ink-foreground shadow-primary" : "border border-border bg-card"}`}>
                {p.featured && <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 font-mono text-[10px] tracking-widest text-primary-foreground">MÁS ELEGIDO</span>}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className={`mt-1 text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.d}</p>
                <p className="mt-6"><span className="text-5xl font-extrabold">{p.price}€</span> <span className="text-sm opacity-70">IVA no incl.</span></p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />{i}</li>)}
                </ul>
                <Button variant={p.featured ? "hero" : "soft"} size="xl" className="mt-8" onClick={() => choose(p.name)}>Lo quiero</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="bg-ink py-24 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <p className="eyebrow">05 / Proceso</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">De la idea a online en 4 pasos</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="border-t border-ink-foreground/20 pt-6">
                <p className="font-mono text-sm text-primary">{n}</p>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm opacity-70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <p className="eyebrow">06 / FAQ</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-surface py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">07 / Contacto</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Empecemos tu web hoy</h2>
            <p className="mt-4 text-muted-foreground">Cuéntanos tu negocio y te respondemos en menos de 24 horas con una propuesta sin compromiso.</p>
            <Button asChild variant="soft" size="xl" className="mt-8"><a href={WA} ><Mail /> Prefiero email</a></Button>
          </div>
          <ContactForm plan={plan} onPlanChange={setPlan} />
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Aladin & Álvaro · AI & Web Studio</p>
          <p className="font-mono text-xs">Hecho en España</p>
        </div>
      </footer>

      <a href={WA} aria-label="Email" className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-primary transition-transform hover:scale-105">
        <Mail className="size-6" />
      </a>
    </div>
  );
}
