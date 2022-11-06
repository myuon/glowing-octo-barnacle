import { css } from "@emotion/react";
import { ComponentPropsWithoutRef } from "react";
import { theme } from "./theme";

export const Paper = ({ ...props }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      css={css`
        padding: 16px;
        border-radius: 12px;
        box-shadow: ${theme.shadow.xxl};
      `}
    />
  );
};
