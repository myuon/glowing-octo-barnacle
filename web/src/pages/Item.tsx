import { css } from "@emotion/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
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
import { TransactionStatementEvent } from "../../../shared/model/transactionStatementEvent";
import {
  useSearchTransactionStatementEvent,
  useTransactionStatementEvent,
} from "../api/useTransactionStatementEvent";
import { backgroundGrayStyle } from "../components/backgroundGray";
import { TextButton } from "../components/Button";
import { SquareIcon } from "../components/Icon";
import { List } from "../components/List";
import { Paper } from "../components/Paper";
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
  const shiftByMonth = useMemo(() => {
    const obj = shift?.reduce(
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
    );

    return obj
      ? Object.values(obj).sort((a, b) =>
          a.transactionDate > b.transactionDate ? 1 : -1
        )
      : undefined;
  }, [shift]);
  const navigate = useNavigate();

  const [childrenMode, setChildrenMode] = useState<"byTitle" | "byDate">(
    "byTitle"
  );
  const childrenByTitle = useMemo(() => {
    return children?.reduce((acc, cur) => {
      if (!acc[cur.title]) {
        acc[cur.title] = [];
      }

      acc[cur.title].push(cur);
      return acc;
    }, {} as Record<string, TransactionStatementEvent[]>);
  }, [children]);

  const [height, setHeight] = useState<number>();

  return (
    <>
      <div css={backgroundGrayStyle(height)} />
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

        <Paper
          css={css`
            display: grid;
            gap: 24px;
            margin: 0 12px;
          `}
          ref={(node) => {
            if (!node) {
              return;
            }

            const rect = node.getBoundingClientRect();
            setHeight(rect.top + rect.height / 2);
          }}
        >
          <p>CHANGES</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={shiftByMonth}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
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
        </Paper>

        <p>DETAILS</p>

        <List>
          {Object.values(shiftByMonth ?? {})?.map((item) => (
            <div
              key={item.transactionDate.toString()}
              css={css`
                display: grid;
                grid-template-columns: auto 1fr auto;
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

        <div
          css={css`
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
          `}
        >
          <p>CHILDREN</p>

          <TextButton
            underlined
            onClick={() => {
              setChildrenMode(
                childrenMode === "byTitle" ? "byDate" : "byTitle"
              );
            }}
          >
            {childrenMode === "byTitle" ? "By Date" : "By Title"}
          </TextButton>
        </div>

        <List>
          {childrenMode === "byDate"
            ? children?.map((c) => (
                <Link
                  key={c.uniqueKey}
                  to={`/item/${c.uniqueKey}`}
                  css={css`
                    color: inherit;
                  `}
                >
                  <TransactionStatementEventItem item={c} />
                </Link>
              ))
            : Object.entries(childrenByTitle ?? {}).map(([title, c]) => (
                <Link
                  key={title}
                  to={`/item/${c[0].uniqueKey}`}
                  css={css`
                    color: inherit;
                  `}
                >
                  <TransactionStatementEventItem
                    item={{
                      ...c[0],
                      amount: c.reduce((acc, cur) => acc + cur.amount, 0),
                    }}
                    captionText={`${c.length} items`}
                  />
                </Link>
              ))}
        </List>
      </div>
    </>
  );
};
