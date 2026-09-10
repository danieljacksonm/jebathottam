import { BUSINESS } from "@/lib/contact";

export type PolicyBulletSection = {
  title: string;
  intro?: string;
  bullets: string[];
};

export type PolicyDoc = {
  slug: "policies" | "cancellation" | "child-pricing";
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  effectiveDate: string;
  sections: PolicyBulletSection[];
  closing?: string;
};

const emailsLine = BUSINESS.emails.join(" · ");

export const policiesDoc: PolicyDoc = {
  slug: "policies",
  path: "/policies",
  title: "Policies & Regulations",
  eyebrow: "Booking terms",
  intro:
    "Canaan Travel Hub is committed to providing reliable and transparent travel services. By making a booking with Canaan Travel Hub, the customer agrees to the following policies and terms.",
  effectiveDate: "10 September 2026",
  sections: [
    {
      title: "1. Booking & Reservation Policy",
      bullets: [
        "All bookings are subject to availability and confirmation by Canaan Travel Hub and the respective service provider.",
        "A booking will be considered confirmed only after the required payment has been received and confirmation has been issued.",
        "Customers must provide accurate information, including names, contact details, travel dates and other required details.",
        "Any error in customer-provided information may result in additional charges or cancellation and will be the customer's responsibility.",
        "Rates and availability may change until the booking is confirmed.",
      ],
    },
    {
      title: "2. Payment Policy",
      bullets: [
        "Payment must be made according to the payment schedule communicated at the time of booking.",
        "Certain services may require full payment in advance.",
        "Bookings may be cancelled or released by the service provider if payment is not received within the specified time.",
        "Applicable taxes, service charges, convenience fees or other charges will be communicated wherever applicable.",
        "Customers are responsible for ensuring that payment is successfully completed.",
      ],
    },
    {
      title: "3. Cancellation & Refund Policy",
      bullets: [
        "Cancellation charges depend on the cancellation policy of the respective airline, hotel, resort, transport operator, activity provider or other supplier.",
        "Some bookings may be partially refundable or completely non-refundable.",
        "Any refund received from the supplier will be processed to the customer after deduction of applicable cancellation charges, service charges and other non-refundable amounts, where applicable.",
        "Canaan Travel Hub cannot guarantee a refund where the supplier's terms do not permit one.",
        "Refund processing time may vary depending on the supplier, bank/payment gateway and transaction method.",
      ],
    },
    {
      title: "4. Rescheduling & Date Changes",
      bullets: [
        "Requests for changes to travel dates, hotel dates, passenger details or other booking information are subject to availability and supplier rules.",
        "Additional charges, fare differences, penalties or service fees may apply.",
        "A change request is not considered confirmed until Canaan Travel Hub provides written confirmation.",
      ],
    },
    {
      title: "5. Hotel & Accommodation Policy",
      bullets: [
        "Hotel check-in and check-out times are determined by the respective property.",
        "Early check-in and late check-out are subject to availability and may involve additional charges.",
        "Room allocation, special requests, meals, extra beds and other facilities are subject to the hotel's confirmation.",
        "Hotel-specific rules regarding identification, security deposits, age restrictions, pets, smoking and other matters must be followed by guests.",
        "Canaan Travel Hub is not responsible for services or facilities that are unavailable due to circumstances controlled by the hotel.",
      ],
    },
    {
      title: "6. Flight & Transportation Policy",
      bullets: [
        "Airline fares, schedules, baggage allowances and other conditions are determined by the respective airline.",
        "Flight schedules may be changed, delayed or cancelled by the airline.",
        "Customers must comply with airline check-in, baggage, documentation and boarding requirements.",
        "Transportation services are subject to the terms and conditions of the respective transport provider.",
      ],
    },
    {
      title: "7. Tour Package Policy",
      bullets: [
        "Package inclusions and exclusions will be clearly communicated before confirmation wherever applicable.",
        "Sightseeing, activities and transportation are subject to weather conditions, local conditions, operational schedules and supplier availability.",
        "The itinerary may be modified when reasonably necessary due to circumstances beyond the control of Canaan Travel Hub.",
        "Additional expenses arising from personal choices or activities not included in the package will be borne by the customer.",
      ],
    },
    {
      title: "8. Travel Documents & Visa",
      bullets: [
        "Customers are responsible for ensuring that they possess valid passports, visas, permits, identification documents and other required travel documents.",
        "Visa approval is solely at the discretion of the relevant embassy, consulate or immigration authority.",
        "Canaan Travel Hub does not guarantee visa approval unless expressly stated otherwise in writing.",
        "Customers should verify document validity and entry requirements before travelling.",
      ],
    },
    {
      title: "9. Customer Responsibility",
      intro: "Customers are responsible for:",
      bullets: [
        "Providing accurate booking and passenger information.",
        "Maintaining valid travel documents.",
        "Following airline, hotel, transport operator and destination rules.",
        "Arriving at airports, hotels and departure points on time.",
        "Paying any personal expenses or charges not included in the confirmed booking.",
        "Respecting local laws, customs and regulations.",
      ],
    },
    {
      title: "10. Supplier & Third-Party Services",
      bullets: [
        "Canaan Travel Hub may arrange services through airlines, hotels, resorts, transport operators, activity providers, destination management companies and other third-party suppliers.",
        "Such services are subject to the respective supplier's terms and conditions. Canaan Travel Hub will make reasonable efforts to assist customers but cannot be held responsible for circumstances directly caused by an independent third-party supplier.",
      ],
    },
    {
      title: "11. Price & Availability Disclaimer",
      bullets: [
        "Prices displayed or quoted by Canaan Travel Hub are subject to availability and may change before booking confirmation.",
        "Promotional rates may have specific terms, limited availability or validity periods.",
        "The final payable amount will be the amount communicated at the time of confirmation.",
      ],
    },
    {
      title: "12. Force Majeure",
      bullets: [
        "Canaan Travel Hub shall not be responsible for failure, delay or interruption of services caused by circumstances beyond reasonable control, including natural disasters, severe weather, pandemics, government restrictions, strikes, civil disturbances, technical failures or other unforeseen circumstances.",
        "Where possible, Canaan Travel Hub will assist customers in communicating with the relevant service provider.",
      ],
    },
    {
      title: "13. Privacy Policy",
      bullets: [
        "Customer information will be collected and used for purposes such as booking, payment processing, customer support, documentation and communication relating to travel services.",
        "Canaan Travel Hub will take reasonable measures to protect customer information and will share necessary information with relevant service providers only when required to provide the requested travel service or where required by law.",
      ],
    },
    {
      title: "14. Complaints & Customer Support",
      bullets: [
        "Customers are encouraged to contact Canaan Travel Hub as soon as possible if they experience an issue during their booking or travel.",
        "We will make reasonable efforts to communicate with the relevant supplier and assist in resolving the issue.",
        "Supplier-specific complaints may also be subject to the supplier's own complaint and resolution procedures.",
      ],
    },
    {
      title: "15. Terms & Conditions",
      bullets: [
        "By making a booking through Canaan Travel Hub, the customer confirms that they have read, understood and agreed to these policies and the applicable terms of the respective service providers.",
        "Canaan Travel Hub reserves the right to update these policies when necessary. The applicable policy will be the version communicated or published at the time of booking, subject to applicable law.",
      ],
    },
  ],
  closing: `Canaan Travel Hub — ${BUSINESS.tagline}\nEmail: ${emailsLine}\nWorking hours: Monday–Saturday, 9:00 AM – 6:00 PM`,
};

export const cancellationDoc: PolicyDoc = {
  slug: "cancellation",
  path: "/cancellation",
  title: "Cancellation & Refund Policy",
  eyebrow: "Cancellations",
  intro:
    "At Canaan Travel Hub, we aim to provide clear and transparent cancellation and refund terms. Since our travel services may involve airlines, hotels, resorts, transport operators, activity providers and other third-party suppliers, cancellation and refund conditions may vary depending on the service booked.",
  effectiveDate: "10 September 2026",
  sections: [
    {
      title: "1. Cancellation Request",
      bullets: [
        "Customers may request cancellation by contacting Canaan Travel Hub through the official communication channels provided at the time of booking.",
        "Cancellation requests will be considered effective only after they are acknowledged by Canaan Travel Hub.",
        "The applicable cancellation date and time will be based on the date and time the cancellation request is received and acknowledged.",
      ],
    },
    {
      title: "2. Supplier Cancellation Rules",
      bullets: [
        "Every booking is subject to the cancellation policy of the respective airline, hotel, resort, transport provider, tour operator or other service provider.",
        "Cancellation charges may vary depending on the booking type, travel date, supplier and time of cancellation.",
        "Certain bookings may be non-refundable or may have strict cancellation conditions.",
        "The applicable cancellation charges will be communicated to the customer wherever available before the booking is confirmed.",
      ],
    },
    {
      title: "3. Refund Eligibility",
      bullets: [
        "Refunds will be processed according to the applicable supplier's refund rules and the terms communicated at the time of booking.",
        "Where a supplier permits a refund, the refundable amount received from the supplier will be processed to the customer after deduction of applicable non-refundable charges, cancellation charges and clearly disclosed service charges, where applicable.",
        "Where the supplier does not permit a refund, the booking may be non-refundable.",
      ],
    },
    {
      title: "4. Service Charges",
      bullets: [
        "Canaan Travel Hub may charge applicable service or processing fees for cancellations, modifications or refund processing where such charges have been disclosed or agreed upon.",
        "Any applicable taxes or third-party charges may also be deducted where legally and contractually applicable.",
      ],
    },
    {
      title: "5. Refund Processing Time",
      bullets: [
        "Refund processing time depends on the respective supplier, airline, hotel, payment gateway and banking system.",
        "Once the refundable amount is received or approved for processing, Canaan Travel Hub will initiate the customer's refund through the applicable payment method.",
        "Bank or payment gateway processing times may vary.",
      ],
    },
    {
      title: "6. Airline Cancellation & Refund",
      intro:
        "Airline tickets are subject to the fare rules and cancellation policies of the respective airline.",
      bullets: [
        "Cancellation fees, fare differences and other applicable charges may apply.",
        "Promotional and discounted fares may be non-refundable or may have special conditions.",
        "Airline schedule changes, cancellations and delays are subject to the airline's applicable rules.",
      ],
    },
    {
      title: "7. Hotel & Resort Cancellation",
      intro:
        "Hotel and resort bookings are subject to the property's cancellation and refund policy.",
      bullets: [
        "Some rooms or promotional rates may be non-refundable.",
        "Cancellation charges may increase closer to the check-in date.",
        "No-show bookings may be fully non-refundable depending on the property's policy.",
      ],
    },
    {
      title: "8. No-Show",
      bullets: [
        "If a customer does not report for the booked service without cancelling within the applicable cancellation period, the booking may be treated as a No-Show.",
        "No-show bookings may be non-refundable depending on the supplier's terms.",
      ],
    },
    {
      title: "9. Cancellation Due to Force Majeure",
      bullets: [
        "If a booking is affected by circumstances beyond reasonable control, such as natural disasters, severe weather, government restrictions, strikes, civil disturbances, pandemics or other unforeseen events, the applicable supplier's rules will determine the available refund, credit or alternative arrangements.",
        "Canaan Travel Hub will make reasonable efforts to assist the customer in communicating with the relevant supplier.",
      ],
    },
    {
      title: "10. Customer-Initiated Changes",
      intro:
        "If the customer requests a change instead of cancellation, such as changing travel dates, passenger details or accommodation dates, the booking may be subject to:",
      bullets: [
        "Availability",
        "Fare differences",
        "Supplier amendment charges",
        "Cancellation/rebooking charges",
        "Applicable Canaan Travel Hub service charges",
        "The change will be confirmed only after the applicable charges are paid and the revised booking is confirmed.",
      ],
    },
    {
      title: "11. Refund Method",
      bullets: [
        "Where possible, refunds will be made through the original payment method used for the booking, subject to payment-provider and supplier procedures.",
        "Customers may be required to provide necessary information for processing the refund.",
      ],
    },
    {
      title: "12. Supplier Cancellation or Service Failure",
      bullets: [
        "If a supplier cancels a service or fails to provide the booked service, Canaan Travel Hub will assist the customer in communicating with the supplier and obtaining any refund or alternative arrangement available under the supplier's applicable terms.",
        "Where the service was advertised or agreed upon but is not provided as represented, Canaan Travel Hub will handle the matter in accordance with applicable law and the booking terms.",
      ],
    },
    {
      title: "13. Important Notice",
      bullets: [
        "Canaan Travel Hub does not impose a universal cancellation percentage because cancellation terms can differ significantly between airlines, hotels, resorts, transport providers and tour operators.",
        "The cancellation and refund terms applicable to the specific booking will be communicated to the customer before confirmation wherever applicable.",
        "By confirming a booking, the customer acknowledges and accepts the applicable cancellation and refund conditions.",
      ],
    },
  ],
  closing: `Canaan Travel Hub — ${BUSINESS.tagline}\nEmail: ${emailsLine}\nWorking hours: Monday–Saturday, 9:00 AM – 6:00 PM`,
};

export const childPricingDoc: PolicyDoc = {
  slug: "child-pricing",
  path: "/child-pricing",
  title: "Child & Infant Pricing Policy",
  eyebrow: "Family travel",
  intro:
    "At Canaan Travel Hub, child and infant pricing is determined based on the applicable policies of the airline, hotel, resort, transportation provider, activity operator and other service providers.",
  effectiveDate: "10 September 2026",
  sections: [
    {
      title: "1. Infant",
      bullets: [
        "An infant is generally considered to be below 2 years of age.",
        "Infant fares and accommodation charges may vary depending on the service provider.",
        "Infants may not be provided with a separate airline seat unless specifically booked as per the airline's applicable rules.",
        "Infant charges, if applicable, will be communicated at the time of booking.",
      ],
    },
    {
      title: "2. Child",
      bullets: [
        "A child is generally considered to be between 2 and 11 years of age.",
        "Child fares or discounts are subject to the applicable supplier's terms and availability.",
        "Some airlines, hotels and tour operators may apply different age limits or pricing structures.",
      ],
    },
    {
      title: "3. Adult",
      bullets: [
        "Guests aged 12 years and above will generally be charged at the applicable adult rate.",
        "Certain suppliers may have different age classifications, and the supplier's policy will apply.",
      ],
    },
    {
      title: "4. Hotel & Extra Bed",
      bullets: [
        "Child pricing may depend on whether the child uses existing bedding, an extra bed, rollaway bed or mattress.",
        "Extra-bed charges may apply depending on the hotel and room category.",
        "Extra beds, cots and specific room arrangements are subject to availability and the hotel's occupancy policy.",
      ],
    },
    {
      title: "5. Age at the Time of Travel",
      bullets: [
        "The child's age must be provided correctly at the time of booking.",
        "Where applicable, age eligibility will be determined according to the supplier's rules and the relevant date of travel.",
        "If the child's actual age does not match the age provided during booking, additional charges may be applicable.",
      ],
    },
    {
      title: "6. Age Proof",
      bullets: [
        "Customers may be required to provide valid age proof for infants and children during check-in, boarding or other service delivery.",
        "If the required age proof is unavailable or the passenger does not meet the applicable child/infant eligibility criteria, the supplier may charge the applicable fare or rate difference.",
      ],
    },
    {
      title: "7. Supplier-Specific Rules",
      bullets: [
        "Child and infant pricing may vary from one supplier to another. Airline, hotel, resort, transport and activity-provider policies will take precedence over the general age categories mentioned above.",
        "The applicable child/infant fare, accommodation charge and inclusions will be confirmed to the customer before the booking is finalized.",
        "Canaan Travel Hub reserves the right to apply the applicable supplier's child and infant pricing rules to each booking.",
      ],
    },
  ],
  closing: `Canaan Travel Hub — ${BUSINESS.tagline}\nEmail: ${emailsLine}\nWorking hours: Monday–Saturday, 9:00 AM – 6:00 PM`,
};

export const policyDocs = [policiesDoc, cancellationDoc, childPricingDoc] as const;
