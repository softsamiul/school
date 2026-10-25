# Data Access

PostgreSQL is the selected database. All schools share one database and schema. School-owned rows carry a `school_id` tenant key; this pooled model is a confirmed product decision and must not be changed to per-school databases without an explicit user decision.

- Resolve the caller's active school membership from authenticated server-side identity. If the user can belong to multiple schools, validate any selected school against that membership before setting request context. Never trust a client-supplied `school_id` as authorization.
- Apply the verified school context to every query for school-owned data. Set `school_id` from server context on writes rather than copying it from request bodies. Include `school_id` in uniqueness constraints when uniqueness is school-local and in relationship constraints where needed to prevent cross-school links.
- Consider PostgreSQL row-level security (RLS) as defense in depth, in addition to explicit application scoping. If used, test with the actual application DB role and account for table-owner and `BYPASSRLS` behavior; RLS is ineffective as a guard when the app role bypasses it.
- Use parameterized SQL or the established ORM/query builder. Never interpolate user-controlled values into SQL.
- Preserve referential integrity with appropriate keys/constraints and use transactions when one user action must update related records atomically.
- Add indexes based on actual query and ordering/filter patterns, commonly including `school_id` before query-specific keys. Paginate potentially large lists and select only fields needed by the caller.
- Keep schema changes in the project's migration mechanism. Explain data/backfill implications and provide a reversible or staged approach where practical. The shared schema migrates once, but backfills must preserve each row's school association.
- Test cross-school access denial for reads, writes, exports, and related-record lookups. Include a caller from school A attempting to access a school B record, and verify no data is returned or changed.
- Never execute destructive or production data changes autonomously. Prepare migration scripts and a reviewable impact summary for a human.
