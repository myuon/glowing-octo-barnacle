import { css } from "@emotion/react";
import { ComponentPropsWithoutRef } from "react";

export interface TextButtonProps extends ComponentPropsWithoutRef<"button"> {
  iconName?: string;
}

export const TextButton = ({
  iconName,
  children,
  ...props
}: TextButtonProps) => {
  return (
    <button
      css={[
        css`
          display: flex;
          gap: 8px;
        `,
        css`
          font-weight: 500;
        `,
      ]}
      {...props}
    >
      {iconName ? <i className={iconName} /> : null}
      {children}
    </button>
  );
};
