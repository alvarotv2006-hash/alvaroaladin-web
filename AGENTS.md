<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Contact requests are inserted from the browser into `contact_messages` (anon INSERT only); reads/updates are admin-only via `has_role` RLS — keeps the form backend-free and the data private.
- Admin access is granted by a `user_roles` row; the first signed-up user becomes admin via trigger — avoids hardcoding emails.
- Clients see their own `contact_messages` via an RLS policy matching the row email to the JWT email — no extra linking table needed.
- User management (list/delete/role toggle) runs in `src/lib/users.functions.ts` with an admin check before using the admin client — the browser can't touch auth users.
- The public chatbot streams from `/api/public/chat` via the AI gateway with a fixed studio prompt — keeps the AI key server-side.
