# Backend Rules

- Keep Express routes in `apps/api/src/routes`. Routes parse requests, call focused data/application code, and return stable response shapes; keep SQL out of React and avoid large route handlers.
- Validate untrusted request data at the API boundary. Reuse `packages/contracts` for shared request/response validation when appropriate.
- Use parameterized `pg` queries for all dynamic values. Keep query code behind `apps/api/src/db` or a feature-specific repository so school-scoped query patterns are easy to review.
- Before implementing business-data routes, establish authentication and authorization. School-user queries use the server-verified school context; platform operators use their separate, full-access operator path. School-specific writes set `school_id` from verified server context, never the request body.
- Keep errors behind centralized middleware. Return stable client errors without SQL, stack traces, secrets, or student/family data. Logs must not include request bodies or personal data.
- Store schema changes as reviewed migrations under `apps/api/migrations`. Never apply destructive or production migrations without a human handoff.
- The starter's health routes are public and contain no school data. Do not copy that public access pattern to business routes.
