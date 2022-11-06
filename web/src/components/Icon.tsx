import { css } from "@emotion/react";
import { theme } from "./theme";

export const SquareIcon = ({
  color = "primary",
  iconName,
}: {
  color?: "primary" | keyof typeof theme.palette.signature;
  iconName: string;
}) => {
  return (
    <div
      css={css`
        display: grid;
        place-items: center;
        height: 100%;
        aspect-ratio: 1;
        background-color: ${color === "primary"
          ? theme.palette.primary.light
          : theme.palette.signature[color].light};
        border-radius: 6px;
      `}
    >
      <i
        className={iconName}
        css={css`
          padding: 6px;
          font-size: 24px;
          line-height: 1;
          color: ${color === "primary"
            ? theme.palette.primary.main
            : theme.palette.signature[color].main};
        `}
      />
    </div>
  );
};
