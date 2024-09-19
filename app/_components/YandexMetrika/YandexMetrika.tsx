"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
    interface ym {
       ym: any;
    }
}

export default function YandexMetrika() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams}`;
        // @ts-ignore
        ym(98344007, "hit", url);
    }, [pathname, searchParams]);

    return null;
}
