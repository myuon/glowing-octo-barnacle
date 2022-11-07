import { css } from "@emotion/react";
import { theme } from "../components/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import { assertIsDefined } from "../helper/assert";
import { SquareIcon } from "../components/Icon";
import { useYearMonth } from "../helper/yearMonth";
import dayjs from "dayjs";
import { TextButton } from "../components/Button";
import { useEffect, useMemo } from "react";
import { formatNumber } from "../helper/number";
import { Paper } from "../components/Paper";
import { useSearchTransactionStatementEvent } from "../api/useTransactionStatementEvent";
import { TransactionStatementEvent } from "../../../shared/model/transactionStatementEvent";
import { List } from "../components/List";

export const MonthlyPage = () => {
  const { ym } = useParams<{ ym: string }>();
  assertIsDefined(ym);

  const { startDate, next, prev } = useYearMonth(ym);

  const navigate = useNavigate();
  useEffect(() => {
    if (ym !== startDate.format("YYYYMM")) {
      navigate(`/monthly/${startDate.format("YYYYMM")}`);
    }
  }, [navigate, startDate, ym]);

  const { data: search } = useSearchTransactionStatementEvent({
    transactionDateSpan: {
      start: startDate.startOf("month").format("YYYY-MM-DD"),
      end: startDate.endOf("month").format("YYYY-MM-DD"),
    },
    onlyNullParentKey: true,
  });
  const { data: children } = useSearchTransactionStatementEvent(
    search
      ? {
          parentKeys: search?.map((s) => s.uniqueKey),
        }
      : undefined
  );
  const childrenByParentKey = useMemo(
    () =>
      children?.reduce((acc, cur) => {
        const parentKey = cur.parentKey;
        if (!parentKey) {
          return acc;
        }
        if (!acc[parentKey]) {
          acc[parentKey] = [];
        }
        acc[parentKey].push(cur);
        return acc;
      }, {} as Record<string, TransactionStatementEvent[]>),
    [children]
  );

  const summary = useMemo(() => {
    if (!search) {
      return undefined;
    }

    const income = search
      ?.filter((v) => v.type === "income")
      .reduce((acc, cur) => acc + cur.amount, 0);
    const expense = search
      ?.filter((v) => v.type === "expense")
      .reduce((acc, cur) => acc + cur.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [search]);

  return (
    <section
      css={css`
        display: grid;
        gap: 24px;
      `}
    >
      <header
        css={css`
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
        `}
      >
        <TextButton
          iconName="bi-arrow-left"
          onClick={() => {
            prev();
          }}
        />
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
            {startDate.format("MMM YYYY")}
          </h2>
        </div>
        <TextButton
          iconName="bi-arrow-right"
          onClick={() => {
            next();
          }}
        />
      </header>

      {summary ? (
        <Paper
          css={css`
            margin-bottom: 16px;
          `}
        >
          <div
            css={css`
              display: grid;
              grid-template-columns: auto auto;
              gap: 8px 24px;
              justify-content: center;
              font-weight: 700;
            `}
          >
            <span
              css={css`
                color: ${theme.palette.signature.income.main};
              `}
            >
              INCOME
            </span>
            <span>
              {formatNumber(summary.income, {
                currency: true,
              })}
            </span>
            <span
              css={css`
                color: ${theme.palette.signature.expense.main};
              `}
            >
              EXPENSE
            </span>
            <span>
              {formatNumber(summary.expense, {
                currency: true,
              })}
            </span>
            <span>BALANCE</span>
            <span>
              {formatNumber(summary.balance, {
                currency: true,
              })}
            </span>
          </div>
        </Paper>
      ) : null}

      <List>
        {search?.map((item) => {
          const children = childrenByParentKey?.[item.uniqueKey];

          return (
            <Link
              to={`/item/${item.uniqueKey}`}
              key={item.uniqueKey}
              css={[
                css`
                  display: grid;
                  grid-template-columns: auto 1fr auto;
                  gap: 12px;
                  align-items: center;
                  justify-content: space-between;
                `,
                css`
                  color: inherit;
                `,
              ]}
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
                  css={css`
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1;
                  `}
                >
                  {item.title}
                  {children && children.length > 0
                    ? ` (${children.length})`
                    : null}
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
            </Link>
          );
        })}
      </List>
    </section>
  );
};
