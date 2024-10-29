"use client"

import { AdminRoute } from "../_utils/protectedRoutes";




export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminRoute>
            {children}
        </AdminRoute>
        
    );
}