"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Building2, User, CreditCard, FileText } from "lucide-react";
import { Input } from "@/components/seller/ui/Input";
import { Select } from "@/components/seller/ui/Select";
import { Textarea } from "@/components/seller/ui/Textarea";
import { FileUpload } from "@/components/seller/ui/FileUpload";
import { Button } from "@/components/seller/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { cn } from "@/lib/utils/helpers";
import {
  businessInfoSchema,
  contactDetailsSchema,
  bankDetailsSchema,
  kycDocumentsSchema,
  INDIAN_STATES,
  BUSINESS_TYPES,
  BUSINESS_CATEGORIES,
  type BusinessInfoInput,
  type ContactDetailsInput,
  type BankDetailsInput,
  type KYCDocumentsInput,
} from "@/lib/validations/seller-registration.schema";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { number: 1, title: "Business Info", icon: Building2, schema: businessInfoSchema },
  { number: 2, title: "Contact Details", icon: User, schema: contactDetailsSchema },
  { number: 3, title: "Bank Details", icon: CreditCard, schema: bankDetailsSchema },
  { number: 4, title: "KYC Documents", icon: FileText, schema: kycDocumentsSchema },
] as const;

export function SellerRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<Partial<BusinessInfoInput & ContactDetailsInput & BankDetailsInput & KYCDocumentsInput>>({});

  // Step 1: Business Info
  const businessForm = useForm<BusinessInfoInput>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: formData,
  });

  // Step 2: Contact Details
  const contactForm = useForm<ContactDetailsInput>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: { pickup_address_same: false, ...formData },
  });

  // Step 3: Bank Details
  const bankForm = useForm<BankDetailsInput>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: formData,
  });

  // Step 4: KYC Documents
  const kycForm = useForm<KYCDocumentsInput>({
    resolver: zodResolver(kycDocumentsSchema),
    defaultValues: { agreement_accepted: false, ...formData },
  });

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1: return businessForm;
      case 2: return contactForm;
      case 3: return bankForm;
      case 4: return kycForm;
    }
  };

  const handleNext = async () => {
    const form = getCurrentForm();
    const isValid = await form.trigger();

    if (isValid) {
      const values = form.getValues();
      setFormData((prev) => ({ ...prev, ...values }));
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as Step);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    const form = getCurrentForm();
    const isValid = await form.trigger();

    if (isValid) {
      const values = form.getValues();
      const finalData = { ...formData, ...values };
      
      // Mock submission
      toast.success("Registration submitted successfully! Our team will review your application within 24-48 hours.");
      console.log("Registration data:", finalData);
      
      // Redirect to login or pending page
      setTimeout(() => {
        window.location.href = "/seller/auth/login";
      }, 2000);
    }
  };

  const pickupAddressSame = contactForm.watch("pickup_address_same");

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = completedSteps.has(step.number);

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-success bg-success text-white",
                    isActive && !isCompleted && "border-primary bg-primary text-white",
                    !isActive && !isCompleted && "border-border bg-surface text-text-muted",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <p className={cn("mt-2 text-xs font-medium", isActive ? "text-text-primary" : "text-text-muted")}>
                  {step.title}
                </p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1", isCompleted ? "bg-success" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Card>
        {currentStep === 1 && (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold">Business Information</h2>
              <p className="text-sm text-text-secondary">Tell us about your business</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Business/Company Name"
                placeholder="ABC Trading Co."
                error={businessForm.formState.errors.business_name?.message}
                {...businessForm.register("business_name")}
              />
              
              <Select
                label="Business Type"
                options={BUSINESS_TYPES}
                error={businessForm.formState.errors.business_type?.message}
                {...businessForm.register("business_type")}
              />

              <Select
                label="Business Category"
                options={BUSINESS_CATEGORIES}
                error={businessForm.formState.errors.business_category?.message}
                {...businessForm.register("business_category")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  error={businessForm.formState.errors.pan?.message}
                  {...businessForm.register("pan")}
                  className="uppercase"
                />
                <Input
                  label="GST Number (Optional)"
                  placeholder="22AAAAA0000A1Z5"
                  error={businessForm.formState.errors.gst_number?.message}
                  {...businessForm.register("gst_number")}
                  className="uppercase"
                />
              </div>

              <Input
                label="Year Established"
                type="number"
                placeholder="2010"
                error={businessForm.formState.errors.year_established?.message}
                {...businessForm.register("year_established", { valueAsNumber: true })}
              />
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <p className="text-sm text-text-secondary">How can we reach you?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Contact Person Name"
                placeholder="John Doe"
                error={contactForm.formState.errors.contact_person_name?.message}
                {...contactForm.register("contact_person_name")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={contactForm.formState.errors.email?.message}
                  {...contactForm.register("email")}
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  placeholder="9876543210"
                  error={contactForm.formState.errors.mobile?.message}
                  {...contactForm.register("mobile")}
                />
              </div>

              <Input
                label="Alternate Mobile (Optional)"
                type="tel"
                placeholder="9876543210"
                error={contactForm.formState.errors.alternate_mobile?.message}
                {...contactForm.register("alternate_mobile")}
              />

              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-semibold">Registered Business Address</h3>
                
                <Textarea
                  label="Address"
                  placeholder="Building/House No., Street, Area"
                  error={contactForm.formState.errors.registered_address?.message}
                  {...contactForm.register("registered_address")}
                />

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Input
                    label="City"
                    placeholder="Mumbai"
                    error={contactForm.formState.errors.city?.message}
                    {...contactForm.register("city")}
                  />
                  <Select
                    label="State"
                    options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
                    error={contactForm.formState.errors.state?.message}
                    {...contactForm.register("state")}
                  />
                  <Input
                    label="Pincode"
                    placeholder="400001"
                    error={contactForm.formState.errors.pincode?.message}
                    {...contactForm.register("pincode")}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    {...contactForm.register("pickup_address_same")}
                  />
                  <span>Pickup address is same as registered address</span>
                </label>

                {!pickupAddressSame && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-sm font-semibold">Pickup Address</h3>
                    
                    <Textarea
                      label="Address"
                      placeholder="Warehouse/Pickup Location"
                      error={contactForm.formState.errors.pickup_address?.message}
                      {...contactForm.register("pickup_address")}
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input
                        label="City"
                        error={contactForm.formState.errors.pickup_city?.message}
                        {...contactForm.register("pickup_city")}
                      />
                      <Select
                        label="State"
                        options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
                        error={contactForm.formState.errors.pickup_state?.message}
                        {...contactForm.register("pickup_state")}
                      />
                      <Input
                        label="Pincode"
                        error={contactForm.formState.errors.pickup_pincode?.message}
                        {...contactForm.register("pickup_pincode")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold">Bank Account Details</h2>
              <p className="text-sm text-text-secondary">For receiving payments</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Account Holder Name"
                placeholder="As per bank records"
                error={bankForm.formState.errors.account_holder_name?.message}
                {...bankForm.register("account_holder_name")}
              />

              <Input
                label="Bank Account Number"
                placeholder="Enter account number"
                error={bankForm.formState.errors.account_number?.message}
                {...bankForm.register("account_number")}
              />

              <Input
                label="Confirm Account Number"
                placeholder="Re-enter account number"
                error={bankForm.formState.errors.account_number_confirm?.message}
                {...bankForm.register("account_number_confirm")}
              />

              <Input
                label="IFSC Code"
                placeholder="SBIN0001234"
                error={bankForm.formState.errors.ifsc_code?.message}
                {...bankForm.register("ifsc_code")}
                className="uppercase"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Bank Name"
                  placeholder="State Bank of India"
                  error={bankForm.formState.errors.bank_name?.message}
                  {...bankForm.register("bank_name")}
                />
                <Input
                  label="Branch Name"
                  placeholder="Mumbai Main Branch"
                  error={bankForm.formState.errors.branch_name?.message}
                  {...bankForm.register("branch_name")}
                />
              </div>

              <div className="rounded-[6px] bg-warning/10 px-4 py-3 text-sm text-warning">
                <strong>Note:</strong> Payments will be processed to this account only. Ensure all details are correct.
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold">KYC Documents</h2>
              <p className="text-sm text-text-secondary">Upload required documents for verification</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Aadhaar Number"
                placeholder="XXXX XXXX XXXX"
                error={kycForm.formState.errors.aadhaar_number?.message}
                {...kycForm.register("aadhaar_number")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FileUpload
                  label="Aadhaar Card (Front)"
                  accept="image/*,.pdf"
                  helperText="JPG, PNG or PDF (Max 5MB)"
                  error={kycForm.formState.errors.aadhaar_front?.message}
                  onChange={(value) => kycForm.setValue("aadhaar_front", value)}
                  value={kycForm.watch("aadhaar_front")}
                />
                <FileUpload
                  label="Aadhaar Card (Back)"
                  accept="image/*,.pdf"
                  helperText="JPG, PNG or PDF (Max 5MB)"
                  error={kycForm.formState.errors.aadhaar_back?.message}
                  onChange={(value) => kycForm.setValue("aadhaar_back", value)}
                  value={kycForm.watch("aadhaar_back")}
                />
              </div>

              <FileUpload
                label="PAN Card"
                accept="image/*,.pdf"
                helperText="JPG, PNG or PDF (Max 5MB)"
                error={kycForm.formState.errors.pan_document?.message}
                onChange={(value) => kycForm.setValue("pan_document", value)}
                value={kycForm.watch("pan_document")}
              />

              <FileUpload
                label="GST Certificate (Optional)"
                accept="image/*,.pdf"
                helperText="JPG, PNG or PDF (Max 5MB)"
                error={kycForm.formState.errors.gst_certificate?.message}
                onChange={(value) => kycForm.setValue("gst_certificate", value ?? "")}
                value={kycForm.watch("gst_certificate")}
              />

              <FileUpload
                label="Cancelled Cheque / Bank Statement"
                accept="image/*,.pdf"
                helperText="For bank account verification (Max 5MB)"
                error={kycForm.formState.errors.cancelled_cheque?.message}
                onChange={(value) => kycForm.setValue("cancelled_cheque", value)}
                value={kycForm.watch("cancelled_cheque")}
              />

              <FileUpload
                label="Business Registration Certificate (Optional)"
                accept="image/*,.pdf"
                helperText="Shop Act, MSME, or Company Registration (Max 5MB)"
                error={kycForm.formState.errors.business_registration?.message}
                onChange={(value) => kycForm.setValue("business_registration", value ?? "")}
                value={kycForm.watch("business_registration")}
              />

              <div className="border-t border-border pt-4">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-border"
                    {...kycForm.register("agreement_accepted")}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Seller Agreement</a>,{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>, and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {kycForm.formState.errors.agreement_accepted && (
                  <p className="mt-1 text-xs text-destructive">
                    {kycForm.formState.errors.agreement_accepted.message}
                  </p>
                )}
              </div>

              <div className="rounded-[6px] bg-primary/10 px-4 py-3 text-sm text-primary">
                <strong>Verification Process:</strong> Our team will review your documents within 24-48 hours. You&apos;ll receive an email once approved.
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              toast.info("Progress saved as draft");
            }}
          >
            Save Draft
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
