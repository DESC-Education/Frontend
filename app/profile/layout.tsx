import { useTypesSelector } from "../_hooks/useTypesSelector";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useTypesSelector((state) => state.userReducer);

    return <div className="container">{children}</div>;
}
