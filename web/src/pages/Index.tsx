import { css } from "@emotion/react";
import { getAuthToken } from "../helper/auth";
import useSWR from "swr";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Table } from "../components/Table";
import { ImportedTransaction } from "./Import";

export const IndexPage = () => {
  const { data: search } = useSWR<ImportedTransaction[]>(
    "/api/transactionStatementEvents/search",
    async (url: string) => {
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
          Authorization: `Bearer ${await getAuthToken()}`,
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

      <ResponsiveContainer
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
    </div>
  );
};
