# Logging and Errors

- Follow the project's logger and response conventions. If none exist, use a consistent structured server logger and a small documented error mapping before adding ad hoc logging.
- Return useful, stable client errors without exposing stack traces, SQL, secrets, or sensitive student/family data.
- Log enough operational context to diagnose failures, but omit credentials and minimize personal data. Use stable identifiers only when policy and access allow.
- Do not swallow exceptions. Handle expected failures explicitly and let unexpected failures reach the application's centralized error handler.
- Avoid duplicate logs at each layer for the same failure; log once where actionable context is available.
