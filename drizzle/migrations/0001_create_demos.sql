CREATE TABLE public.demos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid,
  business text,
  reply text NOT NULL DEFAULT '',
  html text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.demos TO authenticated;
GRANT ALL ON public.demos TO service_role;
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read demos" ON public.demos FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete demos" ON public.demos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));