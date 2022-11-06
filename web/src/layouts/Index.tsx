import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Link, Outlet } from "react-router-dom";
import { theme } from "../components/theme";

export const IndexLayout = () => {
  return (
    <>
      <header
        css={css`
          padding: 8px 16px;
        `}
      >
        <nav
          css={css`
            display: flex;
            gap: 16px;
          `}
        >
          KAKEIBO
        </nav>
      </header>
      <main
        css={css`
          margin-bottom: 120px;
        `}
      >
        <Outlet />
      </main>
      <footer
        css={css`
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 64px;
            font-size: 18px;
            color: ${theme.palette.gray[400]};
            background-color: white;
            box-shadow: ${theme.shadow.footer};

            a {
              color: inherit;
            }
          `}
        >
          <Link to="/">
            <i className="bi-house" />
          </Link>
          <Link to={`/monthly/${dayjs().format("YYYYMM")}`}>
            <i className="bi-graph-up" />
          </Link>
          <Link to="/import">
            <i className="bi-upload" />
          </Link>
          <Link to="/login">
            <i className="bi-gear" />
          </Link>
        </div>
      </footer>
    </>
  );
};
