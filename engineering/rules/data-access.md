# Data Access

PostgreSQL is the selected database. All schools share one database and schema. School-owned rows carry a `school_id` tenant key; this pooled model is a confirmed product decision and must not be changed to per-school databases without an explicit user decision.

- For school users, resolve the single school from authenticated server-side identity before setting request context; one school-user account belongs to one school. Platform operators use a separate authenticated and authorized path with full cross-school access. A requested target `school_id` does not itself authorize access.
- Apply the verified school context to school-user queries. Operator queries use an explicit authorized target-school or all-schools scope. Set `school_id` from server context on school-owned writes rather than copying it from request bodies. Include `school_id` in uniqueness constraints when uniqueness is school-local and in relationship constraints where needed to prevent cross-school links.
- Consider PostgreSQL row-level security (RLS) as defense in depth, in addition to explicit application scoping. If used, test with the actual application DB role and account for table-owner and `BYPASSRLS` behavior; RLS is ineffective as a guard when the app role bypasses it.
- Use parameterized SQL or the established ORM/query builder. Never interpolate user-controlled values into SQL.
- Preserve referential integrity with appropriate keys/constraints and use transactions when one user action must update related records atomically.
- Add indexes based on actual query and ordering/filter patterns, commonly including `school_id` before query-specific keys. Paginate potentially large lists and select only fields needed by the caller.
- Keep schema changes in the project's migration mechanism. Explain data/backfill implications and provide a reversible or staged approach where practical. The shared schema migrates once, but backfills must preserve each row's school association.
- Test that a school user from school A is denied reads, writes, exports, and related-record lookups for school B. Also test that an authorized platform operator can access data across schools through the operator path and that those accesses and writes are audited.
- Never execute destructive or production data changes autonomously. Prepare migration scripts and a reviewable impact summary for a human.
