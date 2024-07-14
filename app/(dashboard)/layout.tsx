import Header from "@/components/Header";
import React, {ReactNode} from "react";

const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <section className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <Header />
      
      <main className="flex w-full flex-grow">{children}</main>
    </section>
  )
}

export default Layout;
