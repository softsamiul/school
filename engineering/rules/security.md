# Security and Privacy

- Treat student and family records as sensitive personal information. Minimize collection, exposure, logging, and retention to the requirements established by the product.
- Enforce authentication and role/ownership authorization on the server. Hiding a React control is not authorization.
- All schools share database tables. For school-user requests, resolve the user's single school from authenticated server-side identity and scope access to its verified `school_id`. Platform operators have full access across schools through a separate authenticated and authorized operator path; a requested school ID selects a target but does not itself authorize access.
- Every school-user read, write, export, and related-record lookup must be restricted to the verified `school_id`. Platform-operator actions may span any school; scope school-specific operations to the selected target school and record operator reads and writes in the audit log. Assign `school_id` server-side on school-owned inserts and prevent cross-school links.
- Consider PostgreSQL row-level security as an additional barrier, not a replacement for application authorization and explicit query scoping. PostgreSQL table owners and roles with `BYPASSRLS` normally bypass policies, so the runtime role must be designed and tested accordingly. [PostgreSQL RLS documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- For every protected route, identify whose record is being accessed and how the caller is allowed to access it. Do not assume roles or membership storage until the product defines them.
- Validate inputs and constrain file uploads, search, sorting, pagination, and identifiers. Avoid leaking secrets, personal records, stack traces, or internal query details in client errors.
- Keep secrets in environment/configuration systems. Never add secret values to code, prompts, fixtures, or logs.
- Consider CSRF, XSS, injection, and rate limiting in context of the app's authentication and deployment design; follow existing controls and flag material gaps.
