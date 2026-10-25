# Coding Standards

- Match the codebase's formatter, lint rules, naming, module system, and file organization. Do not impose TypeScript, a React framework, CSS system, or validation library without evidence or a user decision.
- Use clear names and small functions/components with one visible responsibility. Keep state local unless sharing it is required by the existing design.
- Validate and normalize untrusted input at system boundaries. Reuse established schemas and error shapes when present; do not duplicate validation rules across layers without a reason.
- Handle loading, empty, success, and failure states in user-facing flows. Make controls keyboard-accessible and label inputs meaningfully.
- Keep configuration and credentials out of source. Document required environment variable names, never secret values.
