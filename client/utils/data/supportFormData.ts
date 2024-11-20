import {
  Send,
  AlertCircle,
  MessageSquare,
  Lightbulb,
  Upload,
  X,
} from "lucide-react";

export type Category = "bug" | "feature" | "general";

export const categories = [
  {
    value: "bug",
    label: "Bug Report",
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    value: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
  {
    value: "general",
    label: "General Feedback",
    icon: MessageSquare,
    color: "text-blue-500",
  },
];

export const categoryFields = {
  bug: [
    {
      name: "severity",
      label: "Severity",
      type: "select",
      options: ["Low", "Medium", "High", "Critical"],
    },
  ],
  feature: [
    {
      name: "impact",
      label: "Potential Impact",
      type: "select",
      options: ["Low", "Medium", "High"],
    },
    {
      name: "urgency",
      label: "Urgency",
      type: "select",
      options: ["Low", "Medium", "High"],
    },
  ],
  general: [
    {
      name: "department",
      label: "Related Department",
      type: "select",
      options: [
        "Customer Support",
        "Technical Support",
        "Sales",
        "Billing and Payments",
        "Operations",
        "Other",
      ],
    },
  ],
};

export const departmentDescriptions: Record<string, string> = {
  "Customer Support":
    "Handles issues related to booking, cancellations, and general inquiries about flights and services.",
  "Technical Support":
    "Deals with website or app technical issues, bugs, and problems requiring technical assistance.",
  Sales:
    "Manages inquiries related to group bookings, special rates, and partnerships with travel agencies.",
  "Billing and Payments":
    "Handles questions and problems related to payment processing, refunds, and billing discrepancies.",
  Operations:
    "Addresses issues related to flight schedules, delays, and operational concerns.",
  Other: "For feedback not related to the above departments.",
};
