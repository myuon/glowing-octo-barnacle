export const formatNumber = (
  value: number,
  options?: {
    currency?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) => {
  return new Intl.NumberFormat("ja-JP", {
    style: options?.currency ? "currency" : undefined,
    currency: "JPY",
    maximumFractionDigits: options?.maximumFractionDigits,
    minimumFractionDigits: options?.minimumFractionDigits,
  }).format(value);
};

export const formatShortenedNumber = (
  value: number,
  options?: { digits?: number }
) => {
  if (value < 1000) {
    return `${value}`;
  }

  const digits = options?.digits ?? 2;

  if (value < 1000000) {
    return `${formatNumber(value / 1000, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}K`;
  }

  return `${formatNumber(value / 1000000, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}M`;
};
