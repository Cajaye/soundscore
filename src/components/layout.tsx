import type { PropsWithChildren } from "react";
import Header from "./header";

export const PageLayout = (props: PropsWithChildren) => {
    return(
        <main className="min-h-screen">
        <Header />
        {props.children}
        </main>
    )
}