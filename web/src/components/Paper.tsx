import { css } from "@emotion/react";
import { ComponentPropsWithoutRef } from "react";

export const Paper = ({ ...props }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      css={css`
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgb(17 24 39 / 0.15);
      `}
    />
  );
};
