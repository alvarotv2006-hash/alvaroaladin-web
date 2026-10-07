ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS demo_url text;
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cliente';
CREATE POLICY "Clients read own messages" ON public.contact_messages FOR SELECT TO authenticated
USING (lower(email) = lower(auth.jwt()->>'email'));