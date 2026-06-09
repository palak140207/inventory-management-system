/**
 * Formats a numeric value into the Indian style currency (INR).
 * E.g., 125000 => ₹1,25,000
 * @param {number|string} value - The numeric value to format.
 * @returns {string} The formatted currency string.
 */
export const formatINR = (value) => {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
  
  // Format to en-IN locale
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
};
