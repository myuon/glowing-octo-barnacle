import { css } from "@emotion/react";
import { getAuthToken } from "../components/auth";
import useSWR from "swr";
import { TransactionStatementEvent } from "../../../model/transactionStatementEvent";
import { theme } from "../components/theme";
import dayjs from "dayjs";
import { SquareIcon } from "../components/Icon";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { formatShortenedNumber } from "../helper/number";

export const IndexPage = () => {
  const { data: search } = useSWR<TransactionStatementEvent[]>(
    ["/api/transactionStatementEvents/search", 2022],
    async (url: string) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("not authenticated");
      }

      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          transactionDateSpan: {
            start: dayjs(`20220101`).startOf("month").format("YYYY-MM-DD"),
            end: dayjs(`20221231`).endOf("month").format("YYYY-MM-DD"),
          },
          onlyNullParentKey: true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.json();
    }
  );
  const monthlyData = useMemo(() => {
    const typeMap =
      search?.reduce((acc, cur) => {
        const ym = dayjs(cur.transactionDate).format("YYYYMM");
        if (!acc[ym]) {
          acc[ym] = {};
        }
        if (!acc[ym][cur.type]) {
          acc[ym][cur.type] = 0;
        }

        acc[ym][cur.type] += cur.amount;

        return acc;
      }, {} as Record<string, Record<string, number>>) ?? {};

    return Object.entries(typeMap ?? []).map(([ym, typeMap]) => {
      const startDate = dayjs(`${ym}01`);

      return {
        name: startDate.format("YY'MM"),
        startDate,
        income: typeMap["income"] ?? 0,
        expense: -typeMap["expense"] ?? 0,
      };
    });
  }, [search]);

  return (
    <div
      css={css`
        display: grid;
        gap: 32px;
      `}
    >
      <h2>Overview</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={700}
          height={300}
          data={monthlyData}
          stackOffset="sign"
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
          barSize={10}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.gray[200]}
          />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend iconType="circle" />
          <Bar
            dataKey="income"
            fill={theme.palette.signature.income.main}
            stackId="stack"
          />
          <Bar
            dataKey="expense"
            fill={theme.palette.signature.expense.main}
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>

      <div
        css={css`
          display: grid;

          & > *:not(:last-of-type) {
            border-bottom: 1px solid ${theme.palette.gray[100]};
          }
          & > * {
            padding: 16px 0;
          }
        `}
      >
        {monthlyData?.map((item) => (
          <Link
            to={`/monthly/${item.startDate.format("YYYYMM")}`}
            key={item.name}
            css={css`
              display: grid;
              grid-template-columns: auto 1fr auto auto;
              gap: 16px;
              align-items: center;
              justify-content: space-between;
              color: inherit;
            `}
          >
            <SquareIcon iconName={"bi-cash"} />
            <div
              css={css`
                display: grid;
                gap: 6px;
              `}
            >
              <div
                css={css`
                  font-size: 16px;
                  font-weight: 600;
                  line-height: 1;
                `}
              >
                {item.startDate.format("'YY MMM")}
              </div>
            </div>
            <span
              css={css`
                display: flex;
                gap: 4px;
                font-weight: 700;
                line-height: 1;

                ::before {
                  display: block;
                  width: 14px;
                  height: 14px;
                  content: "";
                  background-color: ${theme.palette.signature.income.main};
                  border-radius: 50%;
                }
              `}
            >
              ￥{formatShortenedNumber(item.income)}
            </span>
            <span
              css={css`
                display: flex;
                gap: 4px;
                font-weight: 700;
                line-height: 1;

                ::before {
                  display: block;
                  width: 14px;
                  height: 14px;
                  content: "";
                  background-color: ${theme.palette.signature.expense.main};
                  border-radius: 50%;
                }
              `}
            >
              ￥{formatShortenedNumber(Math.abs(item.expense))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
