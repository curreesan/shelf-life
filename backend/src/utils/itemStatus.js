const EXPIRING_SOON_DAYS = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const computeStatus = (expiryDate) => {
  const daysUntilExpiry = (new Date(expiryDate) - Date.now()) / MS_PER_DAY;

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= EXPIRING_SOON_DAYS) return "expiring-soon";
  return "fresh";
};
