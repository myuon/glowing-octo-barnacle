import { css } from "@emotion/react";
import { getAuthToken } from "../components/auth";
import useSWR from "swr";
import { TransactionStatementEvent } from "../../../model/transactionStatementEvent";

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
        justify-content: center;
      `}
    >
      <h1>kakeibo</h1>

      <h2>2022/07</h2>

      {search?.map((item) => (
        <div
          key={item.uniqueKey}
          css={css`
            display: grid;
            grid-template-columns: 1fr auto;
            justify-content: space-between;
          `}
        >
          <div>
            <div
              css={css`
                font-weight: 700;
              `}
            >
              {item.title}
            </div>
            <div>{item.description}</div>
          </div>
          <div
            css={css`
              font-weight: 700;
            `}
          >
            {item.type === "income" ? "+" : "-"} ¥{item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};
