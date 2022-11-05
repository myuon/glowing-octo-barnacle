import { css } from "@emotion/react";
import { useRef, useState } from "react";
import Papa from "papaparse";
import Encoding from "encoding-japanese";
import { sha256 } from "../helper/sha256";
import dayjs from "dayjs";
import { sequential } from "../helper/promise";
import { useAuth } from "../helper/auth";
import { Link, useNavigate } from "react-router-dom";

export interface ImportedTransaction {
  schema: string;
  title: string;
  dividedCount: number;
  dividedIndex: number;
  type: string;
  amount: number;
  description: string;
  createdAt: number;
  transactionDate: string;
}

const guessRecordFromHeader = async (
  header: string[],
  row: Record<string, string>
): Promise<ImportedTransaction | undefined> => {
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
    const schema = "MUFG";
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
      createdAt: dayjs().unix(),
      transactionDate: dayjs(
        row["ご利用日"].replace("年", "-").replace("月", "-").replace("日", "")
      ).format("YYYY-MM-DD"),
    };
  }

  return undefined;
};

const addUniqueKeys = async (rows: ImportedTransaction[]) => {
  const dateKey: { [key: string]: Set<string> } = {};
  const result = await sequential(
    rows.map((row) => async () => {
      if (!dateKey[row.transactionDate]) {
        dateKey[row.transactionDate] = new Set();
      }

      const uniqueKeyCandidate = await sha256(JSON.stringify(row));
      if (!dateKey[row.transactionDate].has(uniqueKeyCandidate)) {
        dateKey[row.transactionDate].add(uniqueKeyCandidate);
        console.log(row.transactionDate, uniqueKeyCandidate, row);

        return {
          ...row,
          uniqueKey: uniqueKeyCandidate,
        };
      }

      const key = await sha256(
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
    })
  );

  return result;
};

export const IndexPage = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const header = Object.keys(data[0] ?? {});
  const { token } = useAuth();
  const navigate = useNavigate();
  if (!token) {
    navigate("/login");
  }

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
          {data.length > 0 && (
            <tr>
              {header.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        disabled={data.length === 0}
        onClick={async () => {
          const records = (
            await Promise.all(
              data.map((row) => guessRecordFromHeader(header, row))
            )
          ).filter((t): t is ImportedTransaction => Boolean(t));
          const input = await addUniqueKeys(records);
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

          setData([]);
        }}
      >
        上記内容で登録
      </button>
    </main>
  );
};
