(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__a4cf933a._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/tdt-platform/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tdt-platform/node_modules/@supabase/auth-helpers-nextjs/dist/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/tdt-platform/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tdt-platform/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
async function middleware(req) {
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createMiddlewareClient"])({
        req,
        res
    }, {
        supabaseUrl: 'https://psnfruykkophspphmpnv.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmZydXlra29waHNwcGhtcG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTIxMTMsImV4cCI6MjA3OTc2ODExM30.p-c8lByEDd5Pt7nrLvKghPJl8aR0iIGp9cXIuGVJCWg'
    });
    const { data: { session } } = await supabase.auth.getSession();
    // Protect dashboard routes
    // if (req.nextUrl.pathname.startsWith('/dashboard') ||
    //     req.nextUrl.pathname.startsWith('/admin') ||
    //     req.nextUrl.pathname.startsWith('/affiliate')) {
    //
    //     if (!session) {
    //         return NextResponse.redirect(new URL('/login', req.url))
    //     }
    // }
    // Redirect logged in users away from auth pages
    if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
        if (session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$tdt$2d$platform$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/dashboard', req.url));
        }
    }
    return res;
}
const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/affiliate/:path*',
        '/login',
        '/register'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a4cf933a._.js.map