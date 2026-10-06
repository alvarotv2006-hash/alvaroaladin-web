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
