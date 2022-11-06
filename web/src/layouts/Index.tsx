import { css } from "@emotion/react";
import { Link, Outlet } from "react-router-dom";

export const IndexLayout = () => {
  return (
    <div
      css={css`
        display: grid;
        justify-content: center;
        width: min(1280px, 100%);

        @media screen and (max-width: 1280px) {
          width: 100%;
        }
      `}
    >
      <header>
        <nav
          css={css`
            display: flex;
            gap: 16px;
          `}
        >
          <Link to="/">INDEX</Link>
          <Link to="/import">IMPORT</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
