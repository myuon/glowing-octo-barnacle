import { css } from "@emotion/react";
import { getAuthToken } from "../components/auth";
import useSWR from "swr";
import { TransactionStatementEvent } from "../../../model/transactionStatementEvent";
import { theme } from "../components/theme";
import { useParams } from "react-router-dom";
import { assertIsDefined } from "../helper/assert";
import { SquareIcon } from "../components/Icon";
import { useYearMonth } from "../helper/yearMonth";
import dayjs from "dayjs";

export const MonthlyPage = () => {
  const { ym } = useParams<{ ym: string }>();
  assertIsDefined(ym);

  const { startDate, next, prev } = useYearMonth();

  const { data: search } = useSWR<TransactionStatementEvent[]>(
    ["/api/transactionStatementEvents/search", startDate],
    async (url: string) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("not authenticated");
      }

      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          transactionDateSpan: {
            start: startDate.startOf("month").format("YYYY-MM-DD"),
            end: startDate.endOf("month").format("YYYY-MM-DD"),
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.json();
    }
  );

  return (
    <div
      css={css`
        display: grid;
        gap: 32px;
        padding: 16px;
      `}
    >
      <h1>kakeibo</h1>

      <button
        onClick={() => {
          next();
        }}
      >
        Next
      </button>

      <button
        onClick={() => {
          prev();
        }}
      >
        Prev
      </button>

      <h2>{startDate.format("YYYY/MM")}</h2>

      <div
        css={css`
          display: grid;

          & > *:not(:last-of-type) {
            border-bottom: 1px solid ${theme.palette.gray[100]};
          }
          & > * {
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
        `}
      >
        {search?.map((item) => (
          <div
            key={item.uniqueKey}
            css={css`
              display: grid;
              grid-template-columns: auto 1fr auto;
              gap: 12px;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <SquareIcon
              iconName={
                item.type === "income"
                  ? "bi-piggy-bank"
                  : item.title === "カ－ド"
                  ? "bi-credit-card"
                  : item.title === "水道"
                  ? "bi-house"
                  : item.description.includes("ヤチン")
                  ? "bi-house"
                  : "bi-cash"
              }
            />
            <div
              css={css`
                display: grid;
                gap: 6px;
              `}
            >
              <span
                css={css`
                  font-size: 16px;
                  font-weight: 600;
                  line-height: 1;
                `}
              >
                {item.title}
              </span>
              <small
                css={css`
                  font-size: 12px;
                  line-height: 1;
                  color: ${theme.palette.gray[400]};
                `}
              >
                {item.description}
              </small>
            </div>
            <div
              css={css`
                display: grid;
                gap: 6px;
                text-align: right;
              `}
            >
              <span
                css={css`
                  font-size: 16px;
                  font-weight: 700;
                  line-height: 1;
                `}
              >
                {item.type === "income" ? "+" : "-"}{" "}
                {new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }).format(item.amount)}
              </span>
              <small
                css={css`
                  font-size: 12px;
                  line-height: 1;
                  color: ${theme.palette.gray[400]};
                `}
              >
                {dayjs(item.transactionDate).format("MM/DD")}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
