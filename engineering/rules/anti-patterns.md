# Anti-Patterns

- No database access or authorization decisions in React.
- No authorization based only on client-provided school IDs, role names, or hidden UI controls.
- No unscoped read, update, or delete of school-owned rows; no cross-school relationships or joins that omit school ownership checks.
- No assumption that PostgreSQL RLS protects tables when the application runtime role owns those tables or bypasses RLS.
- No unparameterized SQL, mass assignment of request bodies, or silent validation fallbacks.
- No unbounded list endpoints or queries without a reasoned access path.
- No logging full request bodies or sensitive student/family details.
- No broad refactor bundled into a feature without a clear need and explicit scope.
- No invented stack conventions, dependencies, scripts, or architecture decisions when the repository or user has not established them.
- No autonomous push, merge, deployment, or destructive data operation.
