import React, { ReactNode } from "react";
import AppHeader from "components/AppHeader";
import AppFooter from "components/AppFooter";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div>
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}
