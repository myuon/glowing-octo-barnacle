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

export const formatShortenedNumber = (value: number) => {
  if (value < 1000) {
    return value;
  }

  if (value < 1000000) {
    return `${formatNumber(value / 1000, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}K`;
  }

  return `${formatNumber(value / 1000000, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}M`;
};
