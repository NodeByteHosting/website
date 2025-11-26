"use client";

import type { Metadata } from "next";
import { PageHero } from "components/PageHero";
import { absoluteUrl } from "hooks/absoluteUrl";
import ErrorLayout from "components/Static/ErrorLayout";
import { useEffect, useState, useRef } from "react";

export const metadata: Metadata = {
    title: "500",
    description: "Whoops, something just ain't right here.",
    openGraph: {
        url: "https://nodebyte.host",
        title: "500",
        description: "Whoops, something just ain't right here.",
        images: "/logo.png",
        siteName: "NodeByte Hosting",
    },
    twitter: {
        card: "summary_large_image",
        creator: "@TheRealToxicDev",
        title: "500",
        description: "Whoops, something just ain't right here.",
        images: "/banner.png"

    },
    metadataBase: absoluteUrl()
}

function DebugPanel({ error }: { error?: Error & { stack?: string } }) {
    const [logs, setLogs] = useState<string[]>([]);
    const originals = useRef<Record<string, any>>({});
    const maxLogs = 500;

    useEffect(() => {
        // intercept console methods to capture logs
        const methods = ["log", "info", "warn", "error", "debug"] as const;
        methods.forEach((m) => {
            originals.current[m] = (console as any)[m];
            (console as any)[m] = (...args: any[]) => {
                try {
                    const entry = `[${m.toUpperCase()}] ${args.map(a => {
                        if (typeof a === "string") return a;
                        try { return JSON.stringify(a); } catch { return String(a); }
                    }).join(" ")}`;
                    setLogs(prev => {
                        const next = prev.concat(entry).slice(-maxLogs);
                        return next;
                    });
                } catch (e) {
                    // ignore capture errors
                }
                try { originals.current[m].apply(console, args); } catch { /* ignore */ }
            };
        });

        return () => {
            // restore originals
            methods.forEach((m) => {
                if (originals.current[m]) (console as any)[m] = originals.current[m];
            });
        };
    }, []);

    const copyError = async () => {
        const payload = {
            message: error?.message ?? "No error message",
            stack: error?.stack ?? "No stack",
            logs,
            time: new Date().toISOString()
        };
        try {
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            alert("Error & logs copied to clipboard");
        } catch {
            alert("Copy failed — please inspect and copy manually");
        }
    };

    const downloadLogs = () => {
        const payload = {
            message: error?.message ?? "",
            stack: error?.stack ?? "",
            logs,
            time: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nodebyte-error-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="container mt-6">
            <div className="bg-black_secondary p-4 rounded-md">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Error details</h3>
                        <p className="text-sm text-white/70">Shown to assist debugging — remove in production when resolved.</p>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-sm overflow-auto text-white/80" style={{ maxHeight: 220, whiteSpace: 'pre-wrap' }}>
                            {error ? `${error.message}\n\n${error.stack ?? ""}` : "No error object available"}
                        </pre>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <button onClick={copyError} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Copy error & logs</button>
                        <button onClick={downloadLogs} className="px-3 py-1 rounded bg-green-600 text-black text-sm">Download logs</button>
                        <button onClick={() => setLogs([])} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Clear captured logs</button>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/80">Captured console (latest {logs.length})</h4>
                    <div className="mt-2 bg-gray-900 rounded p-2 max-h-48 overflow-auto text-xs text-white/70">
                        {logs.length === 0 ? <div className="text-white/50">No logs captured on this page load.</div> : logs.map((l, i) => <div key={i} className="py-1 border-b border-gray-800">{l}</div>)}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <>
            <html>
                <body
                    className="bg-gradient-to-br from-grey-900 via-dark_gray to-black border-gray-200"
                    suppressHydrationWarning
                    suppressContentEditableWarning
                >
                    <PageHero
                        text="Oops, something went wrong."
                        title="Internal Server Error"
                    />
                    <ErrorLayout />
                    {/* Debug panel rendered on the error page to surface error and captured console logs */}
                    <DebugPanel error={error} />
                </body>
            </html>
        </>
    );
}
