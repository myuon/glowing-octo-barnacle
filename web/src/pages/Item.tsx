import { css } from "@emotion/react";
import { useParams } from "react-router-dom";
import {
  useSearchTransactionStatementEvent,
  useTransactionStatementEvent,
} from "../api/useTransactionStatementEvent";
import { List } from "../components/List";
import { Paper } from "../components/Paper";
import { assertIsDefined } from "../helper/assert";
import { TransactionStatementEventItem } from "./Item/TransactionStatementEventItem";

export const ItemPage = () => {
  const { uniqueKey } = useParams<{ uniqueKey: string }>();
  assertIsDefined(uniqueKey);

  const { data: item } = useTransactionStatementEvent(uniqueKey);
  const { data: children } = useSearchTransactionStatementEvent({
    parentKeys: [uniqueKey],
  });

  return (
    <div
      css={css`
        display: grid;
        gap: 24px;
      `}
    >
      <div>
        <div
          css={css`
            display: grid;
            justify-content: center;
          `}
        >
          <h2
            css={css`
              font-size: 20px;
            `}
          >
            STATEMENT
          </h2>
        </div>
        <Paper>
          {item ? <TransactionStatementEventItem item={item} /> : null}
        </Paper>
      </div>

      <List>
        {children?.map((c) => (
          <TransactionStatementEventItem key={c.uniqueKey} item={c} />
        ))}
      </List>
    </div>
  );
};
