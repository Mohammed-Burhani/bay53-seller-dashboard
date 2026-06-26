# Product

## Register

product

## Users

Industrial product sellers on Fast Tools — distributors, manufacturers, and traders selling power tools, hand tools, fasteners, safety & PPE, measuring instruments, electrical, and workshop storage. They are business-proficient but not necessarily technical. They use the dashboard daily during working hours (office or warehouse desk) to manage listings, fulfill orders, handle returns, track payments, and respond to B2B inquiries.

## Product Purpose

A full-featured seller control center for Fast Tools (`getfasttools.vercel.app`) that gives every verified seller complete control over their store lifecycle — from product listing through post-delivery resolution. Success means sellers can operate their store without platform support tickets for routine tasks, match the operational depth of Amazon Seller Central, and trust financial and order data at a glance.

## Brand Personality

**Precise · Trustworthy · Efficient**

Industrial precision meets modern SaaS clarity. The interface should feel like the structured catalogues sellers themselves sell — functional, immediately readable, no decorative noise. Voice is professional and direct; microcopy teaches without patronizing.

## Anti-references

- Generic SaaS dashboard templates (identical card grids, hero metrics, gradient accents)
- Cream/sand warm-neutral body backgrounds and AI-default warm tints
- Decorative glassmorphism, gradient text, side-stripe borders on cards
- Over-rounded cards (24px+ radius), ghost-card pattern (border + wide shadow)
- Spinners in content areas, modal-first workflows for simple inline actions
- Consumer e-commerce admin UIs that hide operational depth (wishy-washy empty states, missing bulk actions)
- Dark mode as default "tool aesthetic" without user context justification

## Design Principles

1. **Task-first density** — Information density serves the job; tables, filters, and bulk actions are first-class, not hidden behind cards.
2. **Earned familiarity** — Standard SaaS patterns (sidebar + header, breadcrumbs, command palette, pill tabs) so sellers fluent in business tools feel at home.
3. **One form, two modes** — Create and edit share a single form component per entity; pages pass context via props.
4. **State completeness** — Every surface ships skeleton, empty, error, and success states; destructive actions always confirm.
5. **Bookmarkable tables** — Filter, sort, and pagination sync to URL search params.
6. **Progressive access** — Onboarding and KYC gates limit capabilities clearly; partial access during review is explicit, not broken.

## Accessibility & Inclusion

WCAG 2.1 AA minimum. Focus rings on all interactive elements; status conveyed by color + text/icon. `prefers-reduced-motion` respected on all animations. Form errors inline below fields with scroll-to-first-error. Touch targets ≥44px on mobile nav and primary actions.
