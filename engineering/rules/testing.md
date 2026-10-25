# Testing and Verification

- Discover the repository's actual test, lint, typecheck, and build commands before using them. The initial app template defines development, build, and database migration commands but does not yet include a test runner; do not claim a check passed when it could not be run.
- Choose checks at the changed layer: focused unit tests for logic, API/integration coverage for authorization and persistence, and component/UI checks for meaningful interaction states when supported by the project.
- Cover important negative cases, including invalid input, unauthenticated/unauthorized access, missing related records, and failures in multi-step writes as relevant.
- Prefer deterministic checks. Review findings supplement mechanical checks; they do not replace them.
- Report the exact checks run and their result. If no test infrastructure exists, state the verification gap and suggest the smallest useful next setup without adding a framework implicitly.
