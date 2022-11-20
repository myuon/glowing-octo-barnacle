import { css } from "@emotion/react";
import React from "react";
import { ComponentPropsWithoutRef } from "react";
import { theme } from "./theme";

export const Paper = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => {
  return (
    <div
      {...props}
      css={css`
        padding: 16px;
        background-color: white;
        border-radius: 12px;
        box-shadow: ${theme.shadow.xxl};
      `}
      ref={ref}
    />
  );
});
