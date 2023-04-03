import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return(
     <main className="">
        {props.children}
        </main>
    )
}