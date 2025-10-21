// Currency formatting utilities
export const formatCurrency = (amount: number): string => {
  // Use a deterministic approach to avoid hydration mismatches
  const formatted = amount.toFixed(2);
  const parts = formatted.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `R ${integerPart}.${parts[1]}`;
};

// Convert USD to ZAR (approximate rate: 1 USD = 18.5 ZAR)
export const usdToZar = (usdAmount: number): number => {
  return usdAmount * 18.5;
};

// Convert ZAR to USD (for calculations)
export const zarToUsd = (zarAmount: number): number => {
  return zarAmount / 18.5;
};

