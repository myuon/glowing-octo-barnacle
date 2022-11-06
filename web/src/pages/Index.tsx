import { css } from "@emotion/react";
import { getAuthToken } from "../components/auth";
import useSWR from "swr";
import { TransactionStatementEvent } from "../../../model/transactionStatementEvent";
import { theme } from "../components/theme";

export const IndexPage = () => {
  const { data: search } = useSWR<TransactionStatementEvent[]>(
    "/api/transactionStatementEvents/search",
    async (url: string) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("not authenticated");
      }

      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          transactionDateSpan: {
            start: "2022-07-01",
            end: "2022-07-31",
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

      <h2>2022/07</h2>

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
              grid-template-columns: 1fr auto;
              justify-content: space-between;
            `}
          >
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
                {item.title}
              </div>
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
            <span
              css={css`
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
          </div>
        ))}
      </div>
    </div>
  );
};
