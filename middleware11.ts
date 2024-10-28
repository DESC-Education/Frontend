// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//     const url = request.nextUrl.clone();

//     console.log("helo brow");
    

//     try {
//         // Attempt to fetch the requested page
//         const res = await fetch(request.url, { method: "HEAD" });

//         console.log("11111");
        
//         // If page does not exist (404), redirect to `/` with a 301 status
//         if (res.status === 404) {
//             console.log("22222");
//             url.pathname = "/";
//             return NextResponse.redirect(url, 301);
//         }
//     } catch (error) {
//         // Fallback in case of fetch error, redirect to `/` with a 301
//         url.pathname = "/";
//         return NextResponse.redirect(url, 301);
//     }

//     return NextResponse.next();
// }

// // Apply to all paths
// export const config = {
//     matcher: "/:path*",
// };
