import { css } from "@emotion/react";
import { Link, Outlet } from "react-router-dom";

export const IndexLayout = () => {
  return (
    <div
      css={css`
        display: grid;
        justify-content: center;
        max-width: 1280px;
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
