import { useEffect } from "react";
import { useTypesSelector } from "../_hooks/useTypesSelector";
import { useRouter } from "next/navigation";
import { ProfileRoute } from "../_utils/protectedRoutes";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ProfileRoute>{children}</ProfileRoute>;
}
