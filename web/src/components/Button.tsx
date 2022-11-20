import { css } from "@emotion/react";
import { ComponentPropsWithoutRef } from "react";
import { theme } from "./theme";

export interface TextButtonProps extends ComponentPropsWithoutRef<"button"> {
  iconName?: string;
  underlined?: boolean;
}

export const TextButton = ({
  iconName,
  underlined,
  children,
  ...props
}: TextButtonProps) => {
  return (
    <button
      css={[
        css`
          display: flex;
          gap: 8px;
          padding: 0 4px;
        `,
        css`
          font-weight: 500;
          color: ${theme.palette.gray[600]};
        `,
        underlined &&
          css`
            text-decoration: underline;
          `,
      ]}
      {...props}
    >
      {iconName ? <i className={iconName} /> : null}
      {children}
    </button>
  );
};
