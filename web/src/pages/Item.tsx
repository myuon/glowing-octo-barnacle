import { css } from "@emotion/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useSearchTransactionStatementEvent,
  useTransactionStatementEvent,
} from "../api/useTransactionStatementEvent";
import { TextButton } from "../components/Button";
import { SquareIcon } from "../components/Icon";
import { List } from "../components/List";
import { theme } from "../components/theme";
import { assertIsDefined } from "../helper/assert";
import { formatNumber, formatShortenedNumber } from "../helper/number";
import { TransactionStatementEventItem } from "./Item/TransactionStatementEventItem";

export const ItemPage = () => {
  const { uniqueKey } = useParams<{ uniqueKey: string }>();
  assertIsDefined(uniqueKey);

  const { data: item } = useTransactionStatementEvent(uniqueKey);
  const { data: children } = useSearchTransactionStatementEvent({
    parentKeys: [uniqueKey],
  });
  const { data: shift } = useSearchTransactionStatementEvent(
    item
      ? {
          title: item.title,
        }
      : undefined
  );
  const shiftByMonth = useMemo(
    () =>
      shift?.reduce(
        (acc, cur) => {
          const transactionDate = dayjs(cur.transactionDate);
          const month = transactionDate.format("YYYY-MM");
          if (!acc[month]) {
            acc[month] = {
              transactionDate,
              amount: 0,
            };
          }

          acc[month].amount += cur.amount;
          return acc;
        },
        {} as Record<
          string,
          {
            transactionDate: dayjs.Dayjs;
            amount: number;
          }
        >
      ),
    [shift]
  );
  const navigate = useNavigate();

  return (
    <div
      css={css`
        display: grid;
        gap: 24px;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 8px;
        `}
      >
        <TextButton
          iconName="bi-arrow-left"
          onClick={() => {
            navigate(-1);
          }}
        />
        <p>STATEMENT</p>
      </div>

      {item ? <TransactionStatementEventItem item={item} /> : null}

      <p>CHANGES</p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={shiftByMonth ? Object.values(shiftByMonth) : []}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={(entry) => dayjs(entry.transactionDate).format("MMM")}
          />
          <YAxis
            tickFormatter={(value) =>
              formatShortenedNumber(value, { digits: 1 })
            }
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="amount"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p>DETAILS</p>

      <List>
        {shift?.map((item) => (
          <div
            key={item.uniqueKey}
            css={css`
              display: grid;
              grid-template-columns: auto 1fr auto auto;
              gap: 16px;
              align-items: center;
              justify-content: space-between;
              color: inherit;
            `}
          >
            <SquareIcon iconName={"bi-cash"} color="expense" />
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
                {dayjs(item.transactionDate).format("YYYY/MM/DD")}
              </div>
            </div>
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
                {formatNumber(item.amount, { currency: true })}
              </div>
            </div>
          </div>
        ))}
      </List>

      <p>CHILDREN</p>

      <List>
        {children?.map((c) => (
          <Link
            key={c.uniqueKey}
            to={`/item/${c.uniqueKey}`}
            css={css`
              color: inherit;
            `}
          >
            <TransactionStatementEventItem item={c} />
          </Link>
        ))}
      </List>
    </div>
  );
};
