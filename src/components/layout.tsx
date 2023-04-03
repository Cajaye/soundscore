import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return(
     <main>
        {props.children}
        </main>
    )
}