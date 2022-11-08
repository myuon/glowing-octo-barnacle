import { css } from "@emotion/react";
import dayjs from "dayjs";
import { TransactionStatementEvent } from "../../../../shared/model/transactionStatementEvent";
import { SquareIcon } from "../../components/Icon";
import { theme } from "../../components/theme";
import { lineClamp } from "../../helper/lineClamp";
import { formatNumber } from "../../helper/number";

export const TransactionStatementEventItem = ({
  item,
}: {
  item: TransactionStatementEvent;
}) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <SquareIcon
        color={item.type === "income" ? "income" : "expense"}
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
          css={[
            css`
              font-size: 16px;
              font-weight: 600;
              line-height: 1;
            `,
            lineClamp(1),
          ]}
        >
          {item.title}
        </span>
        <small
          css={[
            css`
              font-size: 12px;
              line-height: 1;
              color: ${theme.palette.gray[400]};
            `,
            lineClamp(1),
          ]}
        >
          {item.description || "-"}
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
          {formatNumber(item.amount, { currency: true })}
        </span>
        <small
          css={css`
            font-size: 12px;
            line-height: 1;
            color: ${theme.palette.gray[400]};
          `}
        >
          {dayjs(item.transactionDate).format("M/D")}
        </small>
      </div>
    </div>
  );
};
