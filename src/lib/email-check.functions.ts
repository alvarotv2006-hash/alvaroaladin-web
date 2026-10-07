import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const emailExists = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ email: z.string().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = data.email.trim().toLowerCase();
    for (let page = 1; page <= 20; page++) {
      const { data: res, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) return { exists: false };
      if (res.users.some((u) => u.email?.toLowerCase() === target)) return { exists: true };
      if (res.users.length < 1000) break;
    }
    return { exists: false };
  });
