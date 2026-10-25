# Architecture

- Keep React presentation, interaction state, and server communication clear at their existing boundaries. Keep Express routing, validation/authorization, application logic, and persistence understandable; follow established project structure rather than imposing a new one.
- Route handlers should make request flow easy to follow. Move reusable or substantial business logic into the repository's established service/helper layer when one exists.
- Keep database operations out of React. The browser talks to documented server endpoints; server code owns authorization and persistence.
- Establish a server-side school context after authentication and membership validation. Pass that context through protected request handling into data-access helpers; do not let React or route payloads select an authoritative tenant.
- Keep query scoping consistent in a shared-database model. Prefer a common data-access boundary that requires school context for school-owned records, reducing the chance that one route forgets its `school_id` filter.
- Prefer extending a suitable existing component, service, or query over creating a duplicate. Avoid abstraction until there is a concrete reuse or complexity it addresses.
- Plans should identify affected layers and state/data flow, not just list filenames.
