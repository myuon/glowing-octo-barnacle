import dayjs from "dayjs";
import { useMemo, useState } from "react";

export const useYearMonth = (defaultYm?: string) => {
  const [yearMonth, setYearMonth] = useState<{ year: number; month: number }>(
    () => {
      const today = defaultYm ? dayjs(`${defaultYm}01`) : dayjs();

      return {
        year: today.year(),
        month: today.month() + 1,
      };
    }
  );
  const startDate = useMemo(
    () => dayjs(`${yearMonth.year}-${yearMonth.month}-01`),
    [yearMonth]
  );

  const next = () => {
    const nextMonth = startDate.add(1, "month");

    setYearMonth({
      year: nextMonth.year(),
      month: nextMonth.month() + 1,
    });
  };

  const prev = () => {
    const prevMonth = startDate.add(-1, "month");

    setYearMonth({
      year: prevMonth.year(),
      month: prevMonth.month() + 1,
    });
  };

  return { yearMonth, startDate, next, prev };
};
