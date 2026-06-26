import { MOCK_SELLER_ID } from "./data";

export interface InventoryRow {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reserved: number;
  threshold: number;
  max_capacity: number;
  last_updated: string;
}

export interface ReturnRow {
  id: string;
  return_number: string;
  order_number: string;
  customer_name: string;
  product_name: string;
  reason: string;
  return_type: "refund" | "replacement";
  status: string;
  requested_at: string;
}

export interface ShipmentRow {
  id: string;
  order_number: string;
  customer_city: string;
  customer_state: string;
  items_count: number;
  weight_kg: number;
  courier: string | null;
  awb: string | null;
  label_status: string;
  status: string;
  estimated_delivery: string | null;
}

export interface TransactionRow {
  id: string;
  date: string;
  type: string;
  order_id: string | null;
  order_number: string | null;
  gross: number;
  deductions: number;
  net: number;
  balance: number;
}

export interface PayoutRow {
  id: string;
  period: string;
  orders_count: number;
  gross: number;
  deductions: number;
  net: number;
  bank_masked: string;
  status: string;
  payout_date: string | null;
}

export interface PromotionRow {
  id: string;
  name: string;
  buyer_title: string;
  type: string;
  value: number;
  apply_to: string;
  uses: number;
  max_uses: number | null;
  start_at: string;
  end_at: string | null;
  status: string;
  sample_price: number;
}

export interface RfqRow {
  id: string;
  inquiry_number: string;
  company_name: string;
  contact_name: string;
  products_count: number;
  product_names: string[];
  quantity: number;
  budget_min: number | null;
  budget_max: number | null;
  submitted_at: string;
  response_deadline: string;
  status: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  city: string;
  state: string;
  buyer_type: "b2c" | "b2b";
  total_orders: number;
  total_spend: number;
  last_order_at: string;
  status: "active" | "inactive";
}

export interface ReviewRow {
  id: string;
  product_name: string;
  rating: number;
  text: string;
  customer_name: string;
  customer_city: string;
  date: string;
  has_images: boolean;
  responded: boolean;
  response_text: string | null;
}

export interface NotificationRow {
  id: string;
  type: string;
  title: string;
  detail: string;
  link: string;
  read: boolean;
  created_at: string;
}

export interface SupportTicketRow {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  message_preview: string;
}

export interface BulkUploadRow {
  id: string;
  file_name: string;
  uploaded_at: string;
  total_rows: number;
  successful: number;
  failed: number;
  status: string;
}

export const mockInventory: InventoryRow[] = [
  { id: "inv-1", product_id: "prod-001", name: "Bosch GSB 18V-55", sku: "BOS-GSB18V55", category: "Power Tools", stock: 42, reserved: 8, threshold: 5, max_capacity: 100, last_updated: "2026-06-25T10:00:00Z" },
  { id: "inv-2", product_id: "prod-002", name: "Stanley FatMax 5m", sku: "STA-FM5M", category: "Measuring", stock: 3, reserved: 2, threshold: 5, max_capacity: 50, last_updated: "2026-06-24T14:00:00Z" },
  { id: "inv-3", product_id: "prod-003", name: "M3 Hex Bolt SS304", sku: "HX-M3-100", category: "Fasteners", stock: 0, reserved: 0, threshold: 10, max_capacity: 200, last_updated: "2026-06-20T09:00:00Z" },
  { id: "inv-4", product_id: "prod-004", name: "Safety Goggles Pro", sku: "SG-PRO", category: "Safety & PPE", stock: 78, reserved: 5, threshold: 15, max_capacity: 120, last_updated: "2026-06-25T08:00:00Z" },
  { id: "inv-5", product_id: "prod-005", name: "Makita Impact Driver", sku: "MAK-IMP18", category: "Power Tools", stock: 12, reserved: 3, threshold: 8, max_capacity: 40, last_updated: "2026-06-23T16:00:00Z" },
];

export const mockReturns: ReturnRow[] = [
  { id: "ret-1", return_number: "RT-1024", order_number: "FT-00418", customer_name: "Priya Sharma", product_name: "Stanley FatMax 5m", reason: "Wrong size received", return_type: "replacement", status: "requested", requested_at: "2026-06-24T11:00:00Z" },
  { id: "ret-2", return_number: "RT-1020", order_number: "FT-00405", customer_name: "Amit Patel", product_name: "Bosch GSB 18V-55", reason: "Defective battery", return_type: "refund", status: "under_review", requested_at: "2026-06-22T09:00:00Z" },
  { id: "ret-3", return_number: "RT-1015", order_number: "FT-00398", customer_name: "Sneha Reddy", product_name: "Safety Goggles Pro", reason: "Not as described", return_type: "refund", status: "approved", requested_at: "2026-06-18T14:00:00Z" },
];

export const mockShipments: ShipmentRow[] = [
  { id: "ship-1", order_number: "FT-00421", customer_city: "Mumbai", customer_state: "MH", items_count: 1, weight_kg: 1.8, courier: null, awb: null, label_status: "pending", status: "pending_label", estimated_delivery: null },
  { id: "ship-2", order_number: "FT-00418", customer_city: "Pune", customer_state: "MH", items_count: 2, weight_kg: 0.4, courier: "Delhivery", awb: "DLV8829104567", label_status: "generated", status: "in_transit", estimated_delivery: "2026-06-27T00:00:00Z" },
  { id: "ship-3", order_number: "FT-00410", customer_city: "Chennai", customer_state: "TN", items_count: 5, weight_kg: 12.5, courier: "BlueDart", awb: "BD7845123098", label_status: "generated", status: "delivered", estimated_delivery: "2026-06-22T00:00:00Z" },
  { id: "ship-4", order_number: "FT-00415", customer_city: "Delhi", customer_state: "DL", items_count: 3, weight_kg: 4.2, courier: "Delhivery", awb: "DLV8829104899", label_status: "generated", status: "out_for_delivery", estimated_delivery: "2026-06-26T00:00:00Z" },
];

export const mockTransactions: TransactionRow[] = [
  { id: "txn-1", date: "2026-06-25T08:30:00Z", type: "sale", order_id: "ord-001", order_number: "FT-00421", gross: 7499, deductions: 750, net: 6749, balance: 89420 },
  { id: "txn-2", date: "2026-06-23T14:00:00Z", type: "sale", order_id: "ord-002", order_number: "FT-00418", gross: 3497, deductions: 350, net: 3047, balance: 82671 },
  { id: "txn-3", date: "2026-06-20T10:00:00Z", type: "commission", order_id: "ord-002", order_number: "FT-00418", gross: 0, deductions: 350, net: -350, balance: 80424 },
  { id: "txn-4", date: "2026-06-18T09:00:00Z", type: "sale", order_id: "ord-003", order_number: "FT-00410", gross: 45500, deductions: 4500, net: 41000, balance: 80774 },
  { id: "txn-5", date: "2026-06-15T00:00:00Z", type: "payout", order_id: null, order_number: null, gross: 0, deductions: 0, net: -62000, balance: 39774 },
];

export const mockPayouts: PayoutRow[] = [
  { id: "pay-1", period: "Jun 8 – Jun 14", orders_count: 12, gross: 62000, deductions: 6200, net: 55800, bank_masked: "XXXX1234", status: "paid", payout_date: "2026-06-15T00:00:00Z" },
  { id: "pay-2", period: "Jun 15 – Jun 21", orders_count: 18, gross: 89420, deductions: 8942, net: 80478, bank_masked: "XXXX1234", status: "processing", payout_date: null },
];

export const mockPromotions: PromotionRow[] = [
  { id: "promo-1", name: "Summer drill sale", buyer_title: "15% off power drills", type: "percentage", value: 15, apply_to: "Power Tools", uses: 24, max_uses: 100, start_at: "2026-06-01T00:00:00Z", end_at: "2026-06-30T23:59:00Z", status: "active", sample_price: 7499 },
  { id: "promo-2", name: "Bulk fastener deal", buyer_title: "₹50 off on fasteners", type: "flat", value: 50, apply_to: "Fasteners", uses: 8, max_uses: 50, start_at: "2026-06-10T00:00:00Z", end_at: null, status: "active", sample_price: 199 },
  { id: "promo-3", name: "PPE bundle", buyer_title: "Buy 2 Get 1", type: "bogo", value: 0, apply_to: "Safety & PPE", uses: 0, max_uses: 20, start_at: "2026-07-01T00:00:00Z", end_at: "2026-07-31T23:59:00Z", status: "scheduled", sample_price: 450 },
];

export const mockRfqs: RfqRow[] = [
  { id: "rfq-1", inquiry_number: "RFQ-8842", company_name: "Tata Steel Pune", contact_name: "Vikram Mehta", products_count: 3, product_names: ["Impact drivers", "Drill bits", "Safety gloves"], quantity: 500, budget_min: 80000, budget_max: 120000, submitted_at: "2026-06-25T06:00:00Z", response_deadline: "2026-06-26T18:00:00Z", status: "new" },
  { id: "rfq-2", inquiry_number: "RFQ-8835", company_name: "L&T Construction", contact_name: "Anita Desai", products_count: 2, product_names: ["Cordless drills", "Measuring tapes"], quantity: 200, budget_min: null, budget_max: null, submitted_at: "2026-06-23T10:00:00Z", response_deadline: "2026-06-28T12:00:00Z", status: "quoted" },
  { id: "rfq-3", inquiry_number: "RFQ-8820", company_name: "Reliance Retail", contact_name: "Karan Singh", products_count: 5, product_names: ["Hand tools set", "Fasteners kit"], quantity: 1000, budget_min: 250000, budget_max: 300000, submitted_at: "2026-06-20T08:00:00Z", response_deadline: "2026-06-24T00:00:00Z", status: "negotiating" },
];

export const mockCustomers: CustomerRow[] = [
  { id: "cust-001", name: "Rajesh Kumar", city: "Mumbai", state: "MH", buyer_type: "b2c", total_orders: 8, total_spend: 42000, last_order_at: "2026-06-25T08:30:00Z", status: "active" },
  { id: "cust-002", name: "ABC Manufacturing", city: "Chennai", state: "TN", buyer_type: "b2b", total_orders: 24, total_spend: 485000, last_order_at: "2026-06-18T09:00:00Z", status: "active" },
  { id: "cust-003", name: "Priya Sharma", city: "Pune", state: "MH", buyer_type: "b2c", total_orders: 3, total_spend: 8900, last_order_at: "2026-06-23T14:00:00Z", status: "active" },
  { id: "cust-004", name: "Western Traders", city: "Ahmedabad", state: "GJ", buyer_type: "b2b", total_orders: 15, total_spend: 198000, last_order_at: "2026-05-10T11:00:00Z", status: "inactive" },
];

export const mockReviews: ReviewRow[] = [
  { id: "rev-1", product_name: "Bosch GSB 18V-55", rating: 5, text: "Excellent torque for industrial use. Battery lasts full shift.", customer_name: "Rajesh Kumar", customer_city: "Mumbai", date: "2026-06-20T10:00:00Z", has_images: true, responded: true, response_text: "Thank you for your feedback!" },
  { id: "rev-2", product_name: "Stanley FatMax 5m", rating: 3, text: "Lock mechanism feels flimsy after 2 weeks.", customer_name: "Priya Sharma", customer_city: "Pune", date: "2026-06-18T15:00:00Z", has_images: false, responded: false, response_text: null },
  { id: "rev-3", product_name: "Safety Goggles Pro", rating: 4, text: "Good clarity and comfortable fit for long hours.", customer_name: "Amit Patel", customer_city: "Bangalore", date: "2026-06-15T09:00:00Z", has_images: true, responded: false, response_text: null },
];

export const mockNotifications: NotificationRow[] = [
  { id: "n-1", type: "order", title: "New order #FT-00421 received", detail: "₹7,499 · 1 item · Prepaid", link: "/seller/dashboard/orders/ord-001", read: false, created_at: "2026-06-25T08:30:00Z" },
  { id: "n-2", type: "return", title: "Return request RT-1024", detail: "Stanley FatMax 5m · Replacement", link: "/seller/dashboard/returns", read: false, created_at: "2026-06-24T11:00:00Z" },
  { id: "n-3", type: "rfq", title: "New RFQ from Tata Steel Pune", detail: "500 units · 3 products", link: "/seller/dashboard/b2b", read: true, created_at: "2026-06-25T06:00:00Z" },
  { id: "n-4", type: "payment", title: "Payout processing", detail: "₹80,478 for Jun 15–21 cycle", link: "/seller/dashboard/payments", read: true, created_at: "2026-06-22T00:00:00Z" },
  { id: "n-5", type: "review", title: "New 3-star review", detail: "Stanley FatMax 5m", link: "/seller/dashboard/reviews", read: true, created_at: "2026-06-18T15:00:00Z" },
];

export const mockSupportTickets: SupportTicketRow[] = [
  { id: "tkt-1", ticket_number: "TKT-4521", subject: "AWB not updating for FT-00418", category: "Order Issue", priority: "high", assigned_to: "Sarah (Support)", status: "in_progress", created_at: "2026-06-24T10:00:00Z", updated_at: "2026-06-25T09:00:00Z", message_preview: "Courier shows delivered but status stuck..." },
  { id: "tkt-2", ticket_number: "TKT-4510", subject: "GST invoice format query", category: "Payment Issue", priority: "low", assigned_to: null, status: "open", created_at: "2026-06-22T14:00:00Z", updated_at: "2026-06-22T14:00:00Z", message_preview: "Need clarification on HSN breakdown..." },
  { id: "tkt-3", ticket_number: "TKT-4498", subject: "Product listing rejected", category: "Product Listing", priority: "medium", assigned_to: "Ravi (Support)", status: "awaiting_seller", created_at: "2026-06-20T11:00:00Z", updated_at: "2026-06-23T16:00:00Z", message_preview: "Please re-upload spec sheet for power drill..." },
];

export const mockBulkUploads: BulkUploadRow[] = [
  { id: "bulk-1", file_name: "products_june_batch.csv", uploaded_at: "2026-06-20T10:00:00Z", total_rows: 45, successful: 42, failed: 3, status: "completed" },
  { id: "bulk-2", file_name: "fasteners_catalog.xlsx", uploaded_at: "2026-06-15T14:00:00Z", total_rows: 120, successful: 118, failed: 2, status: "completed" },
  { id: "bulk-3", file_name: "ppe_items.csv", uploaded_at: "2026-06-25T09:00:00Z", total_rows: 30, successful: 18, failed: 0, status: "processing" },
];

export const mockAnalyticsKpis = {
  revenue: 428450,
  revenueChange: 14.2,
  orders: 156,
  ordersChange: 9.1,
  aov: 2746,
  aovChange: 2.3,
  unitsSold: 892,
  unitsChange: 11.5,
  returnRate: 3.2,
  returnRateChange: -0.8,
};

export const mockRatingDistribution = [
  { stars: 5, count: 42, pct: 58 },
  { stars: 4, count: 18, pct: 25 },
  { stars: 3, count: 8, pct: 11 },
  { stars: 2, count: 3, pct: 4 },
  { stars: 1, count: 2, pct: 2 },
];

export const mockPaymentSummary = {
  payoutBalance: 80478,
  lastPayout: 55800,
  lastPayoutDate: "2026-06-15T00:00:00Z",
  totalEarnings: 1245000,
  totalCommission: 124500,
};

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Business Profile", desc: "Store name, GST, business address", href: "/seller/dashboard/settings/profile", complete: true },
  { id: "store", label: "Store Page", desc: "Logo, banner, policies", href: "/seller/dashboard/settings/store", complete: true },
  { id: "bank", label: "Bank & Payout", desc: "Account details for settlements", href: "/seller/dashboard/settings/bank", complete: true },
  { id: "kyc", label: "KYC Documents", desc: "GST, PAN, registration certificates", href: "/seller/dashboard/settings/kyc", complete: false },
  { id: "team", label: "Team Members", desc: "Sub-users and permissions", href: "/seller/dashboard/settings/team", complete: false },
  { id: "notifications", label: "Notifications", desc: "Email, SMS, in-app preferences", href: "/seller/dashboard/settings/notifications", complete: true },
  { id: "api", label: "API Access", desc: "Keys for ERP integration", href: "/seller/dashboard/settings/api-access", complete: false },
];
