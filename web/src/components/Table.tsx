import { css } from "@emotion/react";
import { theme } from "./theme";

export const Table = ({
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
          word-break: break-all;
        }

        thead tr,
        tbody tr:nth-of-type(even) {
          background-color: ${theme.palette.gray[100]};
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
