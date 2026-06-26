---
name: Fast Tools Seller Dashboard
description: Industrial-precision seller control center for Fast Tools marketplace
colors:
  surface: "#F8F9FA"
  card: "#FFFFFF"
  border: "#E5E7EB"
  sidebar-bg: "#FFFFFF"
  sidebar-active: "#F0F4FF"
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-foreground: "#FFFFFF"
  success: "#16A34A"
  warning: "#D97706"
  destructive: "#DC2626"
  text-primary: "#111827"
  text-secondary: "#6B7280"
  text-muted: "#9CA3AF"
  sidebar-text-active: "#1E40AF"
  status-processing: "#F59E0B"
  status-shipped: "#3B82F6"
  status-delivered: "#10B981"
  status-cancelled: "#EF4444"
  status-returned: "#8B5CF6"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  card-title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  card: "8px"
  button: "6px"
  input: "6px"
  pill: "9999px"
spacing:
  sidebar-width: "256px"
  sidebar-collapsed: "64px"
  header-height: "56px"
  page-padding: "24px"
  table-row-height: "48px"
  content-max-width: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "16px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.input}"
    padding: "8px 12px"
---

<!-- SEED: Pre-implementation tokens from build spec. Re-run $impeccable document after first implementation pass. -->

## Overview

Light-theme industrial SaaS dashboard. **Color strategy: Restrained** — tinted neutrals (`#F8F9FA` surface, white cards) with blue-600 primary accent used only for actions, active nav, and key metrics. A second neutral layer separates sidebar (white) from content surface (near-white gray). Mood: warehouse-office clarity under daylight — sellers scanning numbers, confirming orders, updating stock without visual distraction.

Physical scene: A distributor at a desk beside stacked product boxes, morning light from a window, checking overnight orders and low-stock alerts before the dispatch team arrives. Light theme is mandatory.

Anchor references: **Stripe Dashboard** (financial clarity, restrained tables), **Amazon Seller Central** (operational depth, order-centric workflows), **Linear** (sidebar density, command palette, crisp typography).

## Colors

| Role | Hex | Usage |
|------|-----|-------|
| Surface | `#F8F9FA` | Page background |
| Card | `#FFFFFF` | Panels, cards, sidebar |
| Border | `#E5E7EB` | Dividers, input borders |
| Primary | `#2563EB` | Buttons, links, active accents |
| Primary hover | `#1D4ED8` | Button hover |
| Text primary | `#111827` | Headings, body |
| Text secondary | `#6B7280` | Supporting text |
| Text muted | `#9CA3AF` | Placeholders (verify 4.5:1 on surface) |
| Success | `#16A34A` | Positive trends, delivered |
| Warning | `#D97706` | Alerts, processing |
| Destructive | `#DC2626` | Errors, cancel actions |
| Status processing | `#F59E0B` | Amber status pills |
| Status shipped | `#3B82F6` | Shipped badge |
| Status delivered | `#10B981` | Delivered badge |
| Status cancelled | `#EF4444` | Cancelled badge |
| Status returned | `#8B5CF6` | Returned badge |

Status badges: colored background at ~12% opacity with matching text color. Sidebar active item: `#F0F4FF` bg + left 2px primary border + `#1E40AF` text.

## Typography

- **Family:** Inter (400, 500, 600, 700) for all UI text. Replace Geist from boilerplate.
- **Scale ratio:** ~1.125 (product register). Fixed rem sizes, not fluid clamp on headings.
- **Page heading:** 24px / 700 / -0.02em letter-spacing
- **Section heading:** 18px / 600
- **Card title:** 14px / 600
- **Body:** 14px / 400
- **Label / column headers:** 12px / 500, uppercase for table headers and tags
- **Monospace:** IDs, SKUs, AWB — `font-mono`, gray-600
- **Prose cap:** 65–75ch for long description fields; tables may run wider.

## Elevation

Restrained tonal layering, not heavy shadows. Cards: `border border-border shadow-sm` — **never** pair 1px border with wide blur shadows (ghost-card ban). Modals: subtle shadow, no glassmorphism. Sticky table headers use border-bottom, not shadow stacks.

## Components

### Shell
- Sidebar: 256px fixed desktop, 64px collapsed, white bg, section labels, bottom store identity + logout
- Header: 56px, breadcrumb left, Cmd+K search center, notifications + avatar right
- Mobile: drawer sidebar <1024px; bottom nav (5 icons + More) <768px

### Primitives
- **Button:** Primary filled, Secondary outlined, Ghost for muted/destructive-adjacent
- **Input:** Static label above, border-border, primary focus ring, inline errors 12px red below
- **Card:** white, 8px radius, border + shadow-sm
- **Badge / StatusBadge:** rounded-full, semantic status mapping centralized
- **Table:** zebra odd rows `bg-gray-50`, sticky header, 48px rows, hover highlight
- **Modal:** 560px confirm, 720px forms; full-screen bottom sheet on mobile
- **Empty state:** inline SVG + heading + copy + CTA (unique per module)
- **Loading:** skeleton shimmer matching layout — no content-area spinners
- **Toast:** Sonner, bottom-right, max 3, 4s dismiss

### Forms
- Sticky footer: status segmented control + Discard / Save Draft / Save & Publish
- React Hook Form + Zod; error summary banner on submit failure
- Auto-save draft to localStorage (ProductForm: 30s interval)

## Do's and Don'ts

**Do**
- Use Tailwind custom tokens for all colors (no hex in JSX)
- Sync table filters to URL search params
- Use ConfirmModal for all destructive actions
- Invalidate React Query caches on mutation success
- Show GST inclusive/exclusive splits on financial surfaces

**Don't**
- Side-stripe colored borders on list items (RFQ urgency uses faint bg tint, not left stripe — spec exception noted; prefer bg highlight over border accent)
- Gradient text, decorative motion, numbered section eyebrows on every page
- Duplicate form components for create vs edit
- Full-page spinners or disable entire shell during load
- Export customer contact details; anonymize in exports
