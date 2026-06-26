export const PRODUCT_CATEGORIES = [
  { id: "industrial-tools", name: "Industrial Tools", icon: "Wrench" },
  { id: "power-tools", name: "Power Tools", icon: "Zap" },
  { id: "hand-tools", name: "Hand Tools", icon: "Hammer" },
  { id: "fasteners", name: "Fasteners", icon: "Nut" },
  { id: "safety-ppe", name: "Safety & PPE", icon: "Shield" },
  { id: "measuring", name: "Measuring Instruments", icon: "Ruler" },
  { id: "electrical", name: "Electrical", icon: "Plug" },
  { id: "workshop-storage", name: "Workshop Storage", icon: "Archive" },
  { id: "consumables", name: "Consumables", icon: "Package" },
] as const;

export const GST_RATES = [0, 5, 12, 18, 28] as const;

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

export const PRODUCT_STATUSES = [
  "published",
  "draft",
  "archived",
  "pending_review",
] as const;

export const TEAM_ROLES = [
  "admin",
  "operations",
  "finance",
  "support",
  "catalog",
] as const;

export const TABLE_PAGE_SIZES = [25, 50, 100] as const;

export const SIDEBAR_WIDTH = 256;
export const SIDEBAR_COLLAPSED = 64;
export const HEADER_HEIGHT = 56;
