# Project Memory

Use this file for confirmed project-specific decisions and gotchas, not generalized lessons.

## Confirmed starting context

- Frontend: React with Vite and Tailwind CSS v4.
- Backend: Express.js.
- Database: PostgreSQL, one shared database and schema for all schools. School-owned records are scoped with `school_id`.
- Tenant context: derive the school from the authenticated school-user account on the server. Each school-user account belongs to exactly one school; cross-school memberships/switching are out of scope. The SaaS platform operator (product owner) uses a separate account and has full access across schools; operator data access and changes are audited. The identity provider, detailed role model, and whether to add PostgreSQL row-level security are not yet chosen.
- Repository: one npm-workspace monorepo with `apps/web`, `apps/api`, and `packages/contracts`.
- Initial implementation defaults: Vite, JavaScript ES modules, `pg`, SQL migrations with node-pg-migrate, npm workspaces, and Node.js 24 LTS. These are starter choices, not commitments that prevent a later deliberate change.
- Product decisions: mobile number + SMS OTP login in v1; English UI v1, Bengali v2, Hindi v3; online-only attendance in v1 (offline marking deferred); school notifications deferred; admissions, student records and analytics, class-specific subject and fee structures, fee collection and analytics, exams, and report cards included in v1. Each school's administrator/operator completes admissions using a detailed form and assigns a class/section. The SaaS platform operator (product owner) has full cross-school access; operator reads and changes are audited. Receipt numbers must use a transactional per-school/per-academic-year counter and must never be reused after issuance. Teachers enter marks and prepare report cards for assigned sections; principals review and approve finalization. School administrators can request staff login phone changes; a principal approves them, the change is audited, and the new number must be verified by OTP.
- OTP provider/rate limits and assisted recovery for staff who lose their phone remain to be specified before the authentication feature is planned. Notification provider and message requirements can be decided when that work is prioritized.
- Shared or destructive actions require a human decision.

Update these notes only when repository evidence or the team confirms a decision. Do not treat assumptions as settled architecture.
