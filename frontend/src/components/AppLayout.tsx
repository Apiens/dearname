import React, { ReactNode } from "react";
import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";
import "./AppLayout.scss";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="App">
      <div className="header">
        {/* header will be a simple navbar. */}
        <AppHeader />
      </div>
      <div className="content">{children}</div>
      <div className="footer">
        <AppFooter />
      </div>
    </div>
  );
}
