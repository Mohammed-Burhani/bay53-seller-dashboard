import { z } from "zod";

// Indian phone number validation (10 digits)
const phoneRegex = /^[6-9]\d{9}$/;

// PAN card validation (AAAAA9999A format)
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// GST number validation (22AAAAA9999A1Z5 format)
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Aadhaar validation (12 digits)
const aadhaarRegex = /^\d{12}$/;

// IFSC code validation (AAAA0BBBBBB format)
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Bank account number validation (9-18 digits)
const accountNumberRegex = /^\d{9,18}$/;

// Step 1: Business Information
export const businessInfoSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  business_type: z.enum(["proprietorship", "partnership", "private_limited", "llp", "public_limited"], {
    errorMap: () => ({ message: "Please select a business type" }),
  }),
  pan: z.string().regex(panRegex, "Invalid PAN format (e.g., AAAAA9999A)"),
  gst_number: z.string().regex(gstRegex, "Invalid GST number format").optional().or(z.literal("")),
  business_category: z.enum(["manufacturer", "distributor", "trader", "retailer"], {
    errorMap: () => ({ message: "Please select a business category" }),
  }),
  year_established: z.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in future"),
});

// Step 2: Contact Details
export const contactDetailsSchema = z.object({
  contact_person_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(phoneRegex, "Invalid mobile number (10 digits starting with 6-9)"),
  alternate_mobile: z.string().regex(phoneRegex, "Invalid mobile number").optional().or(z.literal("")),
  registered_address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  pickup_address_same: z.boolean().default(false),
  pickup_address: z.string().optional(),
  pickup_city: z.string().optional(),
  pickup_state: z.string().optional(),
  pickup_pincode: z.string().optional(),
}).refine(
  (data) => {
    if (!data.pickup_address_same) {
      return (
        data.pickup_address &&
        data.pickup_city &&
        data.pickup_state &&
        data.pickup_pincode &&
        /^\d{6}$/.test(data.pickup_pincode)
      );
    }
    return true;
  },
  {
    message: "Pickup address details are required when different from registered address",
    path: ["pickup_address"],
  }
);

// Step 3: Bank Details
export const bankDetailsSchema = z.object({
  account_holder_name: z.string().min(2, "Account holder name is required"),
  account_number: z.string().regex(accountNumberRegex, "Account number must be 9-18 digits"),
  account_number_confirm: z.string(),
  ifsc_code: z.string().regex(ifscRegex, "Invalid IFSC code (e.g., SBIN0001234)"),
  bank_name: z.string().min(2, "Bank name is required"),
  branch_name: z.string().min(2, "Branch name is required"),
}).refine((data) => data.account_number === data.account_number_confirm, {
  message: "Account numbers do not match",
  path: ["account_number_confirm"],
});

// Step 4: KYC Documents
export const kycDocumentsSchema = z.object({
  aadhaar_number: z.string().regex(aadhaarRegex, "Aadhaar must be 12 digits"),
  aadhaar_front: z.string().min(1, "Aadhaar front copy is required"),
  aadhaar_back: z.string().min(1, "Aadhaar back copy is required"),
  pan_document: z.string().min(1, "PAN card copy is required"),
  gst_certificate: z.string().optional(),
  cancelled_cheque: z.string().min(1, "Cancelled cheque/bank statement is required"),
  business_registration: z.string().optional(),
  agreement_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the seller agreement",
  }),
});

// Combined schema for all steps
export const sellerRegistrationSchema = businessInfoSchema
  .and(contactDetailsSchema)
  .and(bankDetailsSchema)
  .and(kycDocumentsSchema);

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;
export type ContactDetailsInput = z.infer<typeof contactDetailsSchema>;
export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;
export type KYCDocumentsInput = z.infer<typeof kycDocumentsSchema>;
export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>;

// Indian states list
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const BUSINESS_TYPES = [
  { value: "proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "private_limited", label: "Private Limited Company" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "public_limited", label: "Public Limited Company" },
] as const;

export const BUSINESS_CATEGORIES = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "distributor", label: "Authorized Distributor" },
  { value: "trader", label: "Trader/Wholesaler" },
  { value: "retailer", label: "Retailer" },
] as const;
