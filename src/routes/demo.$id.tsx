import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDemo } from "@/lib/demo.functions";

export const Route = createFileRoute("/demo/$id")({
  loader: async ({ params }) => {
    const demo = await getDemo({ data: { id: params.id } });
    if (!demo) throw notFound();
    return demo;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Demo para ${loaderData?.business ?? "tu negocio"} — Aladin & Álvaro` },
      { name: "description", content: "Demo de web generada automáticamente por Aladin & Álvaro." },
      { property: "og:title", content: `Demo para ${loaderData?.business ?? "tu negocio"}` },
      { property: "og:description", content: "Tu web de demo, lista en segundos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div><h1 className="text-2xl font-bold">Demo no encontrada</h1><Link to="/" className="mt-4 inline-block text-primary underline">Volver al inicio</Link></div>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center">No se pudo cargar la demo.</div>,
});

function DemoPage() {
  const demo = Route.useLoaderData();
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
        <span>Demo para <strong>{demo.business}</strong> · hecha por Aladin & Álvaro</span>
        <Link to="/" hash="contacto" className="rounded-full bg-primary px-3 py-1 text-primary-foreground">La quiero</Link>
      </div>
      <iframe title="Demo" srcDoc={demo.html} sandbox="" className="w-full flex-1 border-0" />
    </div>
  );
}
