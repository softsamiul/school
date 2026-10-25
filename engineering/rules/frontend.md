# Frontend Rules

- Use React function components and the conventions already present under `apps/web`.
- Keep browser code presentation-focused. It calls the Express API; it never connects to PostgreSQL or makes authorization decisions.
- Use shared schemas from `packages/contracts` for API payloads where they are defined. Validate responses at boundaries when the client depends on their shape.
- For asynchronous UI, expose loading, success, empty, and failure states as applicable. Use semantic HTML, keyboard-operable controls, and clear labels.
- Do not treat a school ID, hidden control, or route choice in the browser as proof of access. The server verifies school membership and scope.
- Do not put secrets or sensitive student/family data in browser bundles, URLs, console logs, analytics, or local storage without an explicit security design.
