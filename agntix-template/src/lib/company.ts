export function companyProfile() {
  return {
    name: "Canaan Travel Hub",
    email: process.env.COMPANY_EMAIL?.trim() || "",
    phone: process.env.COMPANY_PHONE?.trim() || "",
    address: process.env.COMPANY_ADDRESS?.trim() || "",
    gst: process.env.COMPANY_GST?.trim() || "",
  };
}
