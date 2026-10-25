# Architecture

- Keep React presentation, interaction state, and server communication clear at their existing boundaries. Keep Express routing, validation/authorization, application logic, and persistence understandable; follow established project structure rather than imposing a new one.
- Route handlers should make request flow easy to follow. Move reusable or substantial business logic into the repository's established service/helper layer when one exists.
- Keep database operations out of React. The browser talks to documented server endpoints; server code owns authorization and persistence.
- For school-user requests, establish a server-side school context after authentication and identity validation. Platform operators use a separate authenticated and authorized path with full cross-school access. A requested target school is not authorization by itself.
- Keep query scoping consistent in a shared-database model. Require a verified target school for school-specific operations; permit all-school scope only on authorized platform-operator operations.
- Prefer extending a suitable existing component, service, or query over creating a duplicate. Avoid abstraction until there is a concrete reuse or complexity it addresses.
- Plans should identify affected layers and state/data flow, not just list filenames.
