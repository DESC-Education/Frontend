import { ProfileRoute } from "../_utils/protectedRoutes";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ProfileRoute>{children}</ProfileRoute>;
}
