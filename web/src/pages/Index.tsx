import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import Encoding from "encoding-japanese";
import { SHA256 } from "../helper/sha256";
import dayjs from "dayjs";
import { useAuth } from "../helper/auth";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const Table = ({
  header,
  data,
}: {
  header: string[];
  data?: Record<string, string | number>[];
}) => {
  return (
    <table
      css={css`
        th,
        td {
          padding: 4px 8px;
          font-size: 12px;
        }

        tr:nth-of-type(odd) {
          background-color: #eee;
        }
      `}
    >
      <thead>
        {data && data?.length > 0 ? (
          <tr>
            {header.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        ) : null}
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export interface ImportedTransaction {
  schema: string;
  title: string;
  dividedCount: number;
  dividedIndex: number;
  type: string;
  amount: number;
  description: string;
  transactionDate: string;
}

const guessRecordFromHeader = (
  header: string[],
  row: Record<string, string>
): ImportedTransaction | undefined => {
  if (
    JSON.stringify(header) ===
    JSON.stringify([
      "確定情報",
      "お支払日",
      "ご利用店名（海外ご利用店名／海外都市名）",
      "ご利用日",
      "支払回数",
      "何回目",
      "ご利用金額（円）",
      "現地通貨額・通貨名称・換算レート",
    ])
  ) {
    const schema = "MUFG_CREDIT_CARD";
    const amount = Number(row["ご利用金額（円）"]?.replaceAll(",", ""));
    if (!row["ご利用金額（円）"]) {
      return undefined;
    }

    return {
      schema,
      title: row["ご利用店名（海外ご利用店名／海外都市名）"],
      dividedCount: Number(row["支払い回数"]) || 1,
      dividedIndex: Number(row["何回目"]) || 1,
      type: amount > 0 ? "income" : "expense",
      amount: Math.abs(amount),
      description: row["ご利用店名（海外ご利用店名／海外都市名）"],
      transactionDate: dayjs(
        row["ご利用日"].replace("年", "-").replace("月", "-").replace("日", "")
      ).format("YYYY-MM-DD"),
    };
  }
  if (
    JSON.stringify(header) ===
    JSON.stringify([
      "日付",
      "摘要",
      "摘要内容",
      "支払い金額",
      "預かり金額",
      "差引残高",
      "メモ",
      "未資金化区分",
      "入払区分",
    ])
  ) {
    const schema = "MUFG";
    const amount = Number(
      row["支払い金額"]?.replaceAll(",", "") ||
        row["預かり金額"]?.replaceAll(",", "")
    );
    if (isNaN(amount)) {
      return undefined;
    }

    return {
      schema,
      title: row["摘要"] ?? "不明",
      dividedCount: 1,
      dividedIndex: 1,
      type: row["支払い金額"] ? "expense" : "income",
      amount,
      description: row["摘要内容"] ?? "",
      transactionDate: dayjs(row["日付"]).format("YYYY-MM-DD"),
    };
  }

  return undefined;
};

const addUniqueKeys = (rows: ImportedTransaction[]) => {
  const dateKey: { [key: string]: Set<string> } = {};
  const result = rows.map((row) => {
    if (!dateKey[row.transactionDate]) {
      dateKey[row.transactionDate] = new Set();
    }

    const uniqueKeyCandidate = SHA256(JSON.stringify(row));
    if (!dateKey[row.transactionDate].has(uniqueKeyCandidate)) {
      dateKey[row.transactionDate].add(uniqueKeyCandidate);
      console.log(row.transactionDate, uniqueKeyCandidate, row);

      return {
        ...row,
        uniqueKey: uniqueKeyCandidate,
      };
    }

    const key = SHA256(
      `${JSON.stringify(row)}#${dateKey[row.transactionDate].size}`
    );
    if (!dateKey[row.transactionDate].has(key)) {
      dateKey[row.transactionDate].add(key);
      console.log(row.transactionDate, key, row);

      return {
        ...row,
        uniqueKey: key,
      };
    } else {
      console.log(
        `${JSON.stringify(row)}#${dateKey[row.transactionDate].size}`,
        key
      );
      throw new Error("Unique key collision");
    }
  });

  return result;
};

export const IndexPage = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const header = Object.keys(data[0] ?? {});
  const { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const { data: search } = useSWR<ImportedTransaction[]>(
    token ? [token, "/api/transactionStatementEvents/search"] : null,
    async (token: string, url: string) => {
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
    <main
      css={css`
        display: grid;
        gap: 32px;
        justify-content: center;
      `}
    >
      <Link to="/login">LOGIN</Link>
      <h1>kakeibo</h1>

      <ResponsiveContainer
        width="100%"
        height="100%"
        css={css`
          display: grid;
          place-items: center;
        `}
      >
        <>
          <PieChart width={500} height={400}>
            <Pie
              data={search?.filter((t) => t.type === "income") ?? []}
              dataKey="amount"
              cx={120}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              label={(entry) => entry.title.slice(0, 10)}
            />
            <Pie
              data={search?.filter((t) => t.type === "expense") ?? []}
              dataKey="amount"
              cx={400}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#14b8a6"
              paddingAngle={5}
              label={(entry) => entry.title.slice(0, 10)}
            />
            <Tooltip />
          </PieChart>
        </>
      </ResponsiveContainer>

      <Table header={[]} data={search?.map((t) => ({ ...t }))} />

      <button
        onClick={() => {
          ref.current?.click();
        }}
      >
        アップロード
      </button>
      <input
        type="file"
        accept="text/csv"
        css={css`
          display: none;
        `}
        ref={ref}
        onChange={async (event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          const file = files?.[0];
          if (!file) {
            return;
          }

          const content = Encoding.convert(
            new Uint8Array(await file.arrayBuffer()),
            {
              to: "UNICODE",
              type: "string",
            }
          );

          const result = Papa.parse<Record<string, string>>(content, {
            header: true,
          });

          setData((prev) => [...prev, ...result.data]);
        }}
      />

      <Table header={header} data={data} />

      <button
        disabled={data.length === 0}
        onClick={async () => {
          const records = data
            .map((row) => guessRecordFromHeader(header, row))
            .filter((t): t is ImportedTransaction => Boolean(t));
          const input = addUniqueKeys(records);
          console.log(input);

          const resp = await fetch("/api/transactionStatementEvents", {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(await resp.text());

          if (resp.ok) {
            setData([]);
          }
        }}
      >
        上記内容で登録
      </button>
    </main>
  );
};
