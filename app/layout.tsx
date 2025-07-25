import type { Metadata, Viewport } from "next";
import "./_scss/globals.scss";

import localFont from "next/font/local";
import Providers from "./_context/Providers";
import { Suspense, useEffect } from "react";
import LocalStorage from "./_utils/LocalStorage";
import { auth } from "./_http/API/userApi";
import { useTypesSelector } from "./_hooks/useTypesSelector";
import { useTypesDispatch } from "./_hooks/useTypesDispatch";
import { userSlice } from "./_store/reducers/userSlice";
import { contentSlice } from "./_store/reducers/contentSlice";
import ClientRootLayout from "./_components/ClientRootLayout/ClientRootLayout";
import LoadingScreen from "./_components/LoadingScreen/LoadingScreen";
import Header from "./_components/Header/Header";
import Footer from "./_components/Footer/Footer";
import Head from "next/head";
import hummingbird from "../public/images/hummingbird.jpg";
import Script from "next/script";
import YandexMetrika from "./_components/YandexMetrika/YandexMetrika";

const gilroy = localFont({
    src: [
        {
            path: "../public/fonts/Gilroy-Medium.ttf",
            weight: "500",
            style: "medium",
        },
        {
            path: "../public/fonts/Gilroy-Medium.woff",
            weight: "500",
            style: "medium",
        },
        {
            path: "../public/fonts/Gilroy-Light.ttf",
            weight: "300",
            style: "light",
        },
        {
            path: "../public/fonts/Gilroy-Light.woff",
            weight: "300",
            style: "light",
        },
    ],
    display: "swap",
    variable: "--font",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    // maximumScale: 1,
    // userScalable: false,
};

export const metadata: Metadata = {
    title: "DESC Education",
    description:
        "Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях.",
    icons: {
        icon: [
            {
                url: "/favicons/favicon.ico",
                type: "image/x-icon",
                rel: "icon",
            },
            {
                url: "/favicons/apple-touch-icon.png",
                type: "image/png",
                rel: "apple-touch-icon",
            },
            {
                url: "/favicons/favicon-32x32.png",
                type: "image/png",
                rel: "icon",
                sizes: "32x32",
            },
            {
                url: "/favicons/favicon-16x16.png",
                type: "image/png",
                rel: "icon",
                sizes: "16x16",
            },
        ],
    },
    metadataBase: new URL("https://desc-education.ru"),
    openGraph: {
        title: "DESC Education",
        description:
            "Desc Education - инновационная платформа, соединяющая студентов IT-специальностей с компаниями, которые нуждаются в IT-решениях.",
        images: hummingbird.src,
        siteName: "DESC Education",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head></head>
            <body className={gilroy.className}>
                <Script id="metrika-counter" strategy="afterInteractive">
                    {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(100052247, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });;`}
                </Script>
                <Suspense fallback={<></>}>
                    <YandexMetrika />
                </Suspense>
                <Providers>
                    <ClientRootLayout>
                        <>
                            <Header />
                            <LoadingScreen />
                            {children}
                            <Footer />
                        </>
                    </ClientRootLayout>
                </Providers>
            </body>
        </html>
    );
}
