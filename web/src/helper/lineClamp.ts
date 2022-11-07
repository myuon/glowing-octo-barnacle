import { css } from "@emotion/react";

export const lineClamp = (num: number) => css`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${num};
`;
