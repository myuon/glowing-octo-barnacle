import { css } from "@emotion/react";
import React from "react";
import { theme } from "./theme";

export const List = ({ children }: { children?: React.ReactNode[] }) => {
  return (
    <div
      css={css`
        display: grid;

        & > *:not(:last-of-type) {
          border-bottom: 1px solid ${theme.palette.gray[100]};
        }
        & > * {
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
      `}
    >
      {children}
    </div>
  );
};
