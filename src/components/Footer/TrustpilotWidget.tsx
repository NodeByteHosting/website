'use client';
import { useEffect, useRef, useState } from 'react';
import { SiTrustpilot } from 'react-icons/si';
import { Logo } from 'ui/Logo';

export default function TrustpilotWidget() {
    // Read client-safe env var (NEXT_PUBLIC_*) — inlined at build time by Next.
    const BUSINESS_UNIT_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID;
    const showWidget = Boolean(BUSINESS_UNIT_ID);

    const widgetRef = useRef<HTMLDivElement | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Only run Trustpilot init logic when we actually will render the TP container
    useEffect(() => {
        if (!showWidget) {
            // no business id → never attempt to init trustpilot
            return;
        }

        let interval: number | null = null;
        let attempts = 0;
        const maxAttempts = 20; // ~5 seconds at 250ms interval
        let observer: MutationObserver | null = null;
        let stabilityTimer: number | null = null;
        const STABILITY_MS = 700;
        const SAFETY_TIMEOUT = 7000;

        function hasMeaningfulContent(el: HTMLDivElement | null) {
            if (!el) return false;
            const text = el.innerText?.trim();
            if (text && text.length > 0) return true;
            if (el.querySelector('a, iframe, .tp-widget, .trustpilot-rating')) return true;
            return el.childNodes && el.childNodes.length > 0;
        }

        function confirmInitialized() {
            if (hasMeaningfulContent(widgetRef.current)) {
                setInitialized(true);
                if (observer) { observer.disconnect(); observer = null; }
                if (interval) { clearInterval(interval); interval = null; }
                if (stabilityTimer) { clearTimeout(stabilityTimer); stabilityTimer = null; }
            }
        }

        function tryInit() {
            attempts++;
            const tp = (window as any).Trustpilot;
            if (tp && widgetRef.current) {
                try {
                    if (typeof tp.loadFromElement === 'function') {
                        tp.loadFromElement(widgetRef.current, true);
                    }
                } catch (e) {
                    // wait for DOM changes via observer
                }

                if (!observer && widgetRef.current) {
                    observer = new MutationObserver(() => {
                        if (stabilityTimer) clearTimeout(stabilityTimer);
                        stabilityTimer = window.setTimeout(confirmInitialized, STABILITY_MS);
                    });
                    try { observer.observe(widgetRef.current, { childList: true, subtree: true, characterData: true }); } catch (e) { /* ignore */ }
                    if (hasMeaningfulContent(widgetRef.current)) {
                        stabilityTimer = window.setTimeout(confirmInitialized, STABILITY_MS);
                    }
                }

                if (interval) { clearInterval(interval); interval = null; }
            } else if (attempts >= maxAttempts) {
                if (interval) { clearInterval(interval); interval = null; }
            }
        }

        interval = window.setInterval(tryInit, 250);
        tryInit();

        const safetyTimer = window.setTimeout(() => {
            if (!initialized) {
                if (interval) { clearInterval(interval); interval = null; }
                if (observer) { observer.disconnect(); observer = null; }
            }
        }, SAFETY_TIMEOUT);

        return () => {
            if (interval) clearInterval(interval);
            if (observer) observer.disconnect();
            if (stabilityTimer) clearTimeout(stabilityTimer);
            clearTimeout(safetyTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showWidget]);

    return (
        <div className="trustpilot-wrapper mt-3">
            {/* Render actual Trustpilot widget container only when a business id is provided */}
            {showWidget && (
                <div
                    ref={widgetRef}
                    className="trustpilot-widget"
                    data-locale="en-GB"
                    data-template-id="53aa8807dec7e10d38f59f36"
                    data-businessunit-id={BUSINESS_UNIT_ID}
                    data-style-height="40px"
                    data-style-width="100%"
                    data-theme="dark"
                    role="region"
                    aria-label="Trustpilot review widget"
                />
            )}

            {/* Branded fallback: shown when widget is not initialized OR business id is not present */}
            {(!initialized || !showWidget) && (
                <div className="tp-fallback rounded-md p-3 shadow-sm flex items-center justify-between" role="note" aria-hidden={initialized ? 'true' : 'false'}>
                    <div className="flex items-center gap-3">
                        <div className="tp-badge w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-green-600 text-white">
                            <SiTrustpilot size={28} />
                        </div>
                        <div>
                            <div className="text-sm text-white/80">Customer Reviews</div>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 leading-none" aria-hidden>★★★★</span>
                                <span className="text-sm text-white/70">4.1</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inline styles kept minimal — main theme styling moved to footer SCSS for consistency */}
            <style jsx>{`
				.trustpilot-wrapper { display: block; margin-top: 0.5rem; width: 100%; }
				.trustpilot-widget { display: block; min-height: 56px; width: 100%; background: transparent !important; }
				.tp-fallback { background: linear-gradient(90deg, rgba(6,12,34,0.6), rgba(7,16,26,0.45)); border: 1px solid rgba(255,255,255,0.04); backdrop-filter: blur(6px); color: #e6eef0; }
				.tp-badge :global(svg) { width: 22px; height: 22px; color: white; }
			`}</style>
        </div>
    );
}
