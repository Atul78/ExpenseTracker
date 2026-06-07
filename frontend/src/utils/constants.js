export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Education",
  "Travel",
  "Housing",
  "Other",
];

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Other",
];

export const CATEGORY_ICONS = {
  "Food & Dining": "🍽️",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Healthcare: "💊",
  Utilities: "💡",
  Education: "📚",
  Travel: "✈️",
  Housing: "🏠",
  Other: "📦",
};

export const CATEGORY_BADGE_CLASS = {
  "Food & Dining": "badge-food",
  Transportation: "badge-transport",
  Shopping: "badge-shopping",
  Entertainment: "badge-entertainment",
  Healthcare: "badge-healthcare",
  Utilities: "badge-utilities",
  Education: "badge-education",
  Travel: "badge-travel",
  Housing: "badge-housing",
  Other: "badge-other",
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
