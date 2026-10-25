# School SaaS — Product Requirements

**Status:** Product direction and v1 scope. Detailed workflows and acceptance criteria belong in feature specs written just before planning each feature.

## Product and customer

Build a school-management SaaS for private K–12 schools in West Bengal, India. Schools have different academic calendars, grading systems, attendance policies, and fee structures, so the product must let each school configure its own policies.

The initial pilot profile is a fictional urban CBSE school with about 900 students, Nursery to Class 12, one campus, about 55 teachers, and 20 non-teaching staff. It represents a starting pilot, not a limitation to CBSE schools. The owner/trustee approves spending; the school administrator runs daily operations; the principal leads academic and school-wide work.

The product should reduce time spent on student records, attendance, fee collection, and report cards, while giving authorized staff one reliable record of each student across school years. Students, guardians, staff, attendance, academic results, and financial records are sensitive data.

## Users, school boundaries, and access

- **School administrator (school operator):** manages that school's setup, staff, admissions, student records, attendance, and fees. Each school has its own administrator/operator; the owner/trustee may use this role in v1.
- **Principal:** school-wide academic and operational oversight; approves defined actions, including staff login-number changes and finalized report cards.
- **Teacher:** works with assigned sections, marks attendance, enters marks, and prepares report cards for those sections.
- **Parent/guardian and student:** no login in v1; portals are later candidates. Guardian contact records are maintained for school operations.
- **SaaS platform operator:** the product owner/operator (you), with full access across all schools and their data and operations, including student, guardian, staff, attendance, academic, and financial records. This is a separate internal account, not a school's administrator/operator. Access and actions are audited.

Each school-user account belongs to exactly one school, now and in later releases. All schools share one PostgreSQL database; every school-owned record is associated with its school. School-user access is restricted to that school. The SaaS platform operator can access any school through the operator authorization path. One school has one campus in v1; multi-campus support is a later release.

## V1 scope

1. **School and academic setup:** school profile; academic years and terms; class/section structure; subjects configured for each class; and attendance, grading, and fee configuration. Fee structures can vary by class and academic year. Provide editable example defaults rather than universal rules.
2. **Admissions, student records, enrollment, and student analytics:** each school's administrator/operator completes a detailed admission form, admits the student, records guardian contacts and admission status, and assigns the student to a school year, class, and section. Staff can review student enrollment and distribution analytics, such as counts by academic year, class, section, and admission status. Exact form fields and analytics belong in the relevant feature specs.
3. **Attendance:** online marking and review by authorized staff, using school-configured calendar and statuses. Offline marking and later sync are deferred.
4. **Fees, collection, and analytics:** configure fee heads and class-specific schedules, record charges and adjustments, collect and record external payments (cash, UPI, bank transfer, cheque), issue receipts, and review collections, outstanding balances, dues, and defaulters. No payment gateway in v1. Exact analytics and report filters belong in the fees feature spec.
5. **Exams and report cards:** configure assessments and grading, record marks, calculate results using school settings, and prepare report cards. Teachers handle assigned sections; principals review and approve finalization.

School-wide notifications (including SMS/WhatsApp notices), online payments, timetable, transport, library, payroll/HR, LMS, native mobile apps, and parent/student portals are deferred. SMS remains required for staff OTP login.

## School-specific policies and starting defaults

Each school can start from a product-provided template, then change its own settings. This includes which subjects each class offers and each class's fee structure. Defaults must not silently impose one school's policy on another or rewrite historical attendance, assessments, invoices, or receipts.

Example defaults may include an April–March academic year; Nursery, LKG, UKG, and Classes 1–12; Monday–Saturday working days; sample attendance statuses; editable grading templates; and sample fee heads with quarterly installments. These are onboarding examples only. The school selects its academic-year dates and name during setup; derive the suggested name from the selected year (for example, `YYYY-YY`) rather than hard-coding `2026-27`. English UI is v1, Bengali v2, and Hindi v3. UI strings should use translation keys; names and addresses support Unicode.

## Product rules and safeguards

- Enforce authentication, school scope, role permissions, and teacher section assignments in the API. Never trust a client-supplied school ID as authorization.
- Use invite-only staff accounts and mobile-number + SMS OTP login. A school administrator can request a staff phone/login-number change; a principal approves it. Audit the request and approval, verify the new number by OTP, and revoke existing sessions when the change is approved.
- The SaaS platform operator has full cross-school access; operator reads and changes are audited. Product audit history remains append-only.
- A school can configure its own academic years, terms, working days, attendance statuses, grading rules, fee heads, due dates, and adjustments.
- Record money in integer paise. Receipts are immutable and numbered with a strict no-gap counter per school and academic year. Allocate the number in the same database transaction as the payment and receipt; failed transactions must not consume a number. Reversed receipts retain their number and are never reused.
- Use server-side authorization and school-scoped data access for school users. Keep student and family information out of logs and unnecessary exports.
- Do not use real student data in development or staging. Before launch, define retention, recovery, and incident procedures and obtain qualified legal review of privacy notices, school contracts, consent handling, and applicable Indian and West Bengal requirements. The school/product legal roles are a working assumption for counsel to confirm.

## Roadmap and delivery order

1. Identity, school-user accounts, platform-operator access, roles, and tenant-safe authorization.
2. School setup, class/subject and fee structures, admissions, student enrollment, and student analytics.
3. Attendance.
4. Fee collection, receipts, and fee analytics.
5. Exams and report cards.
6. Later: multi-campus support, school notifications, and family/student portals.

Build backend APIs and agree their contracts and school/role behavior before starting the React frontend. Each feature plan should use this PRD plus its just-in-time feature spec.

## Pilot success

Agree numerical targets with the pilot school. Track school setup and enrollment completeness, attendance recorded on working days, fee-ledger accuracy and receipt adoption, time to produce a fee report and report cards, staff adoption, and support burden. The launch should have no tenant-isolation failures that expose one school's data to another school; authorized SaaS platform-operator access is audited and is not an exposure incident. No receipts should be lost or edited.
