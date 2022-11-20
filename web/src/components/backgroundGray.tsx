import { css } from "@emotion/react";
import { theme } from "./theme";

export const backgroundGrayStyle = (height: number | undefined) =>
  height
    ? css`
        position: absolute;
        top: 0px;
        left: 0;
        z-index: -1;
        width: 100%;
        height: ${height}px;
        background-color: ${theme.palette.backgroundGray};
        border-radius: 0 0 12px 12px;
      `
    : undefined;
