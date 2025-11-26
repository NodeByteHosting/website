'use client';
import { useEffect, useRef, useState } from 'react';
import { SiTrustpilot } from 'react-icons/si';
import { Logo } from 'ui/Logo';

export default function TrustpilotWidget() {
    // Replace data-businessunit-id with your Trustpilot business unit id if you have it.
    const widgetRef = useRef<HTMLDivElement | null>(null);
    // initialized -> widget injected and stable, hide fallback
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        let interval: number | null = null;
        let attempts = 0;
        const maxAttempts = 20; // ~5 seconds at 250ms interval
        let observer: MutationObserver | null = null;
        let stabilityTimer: number | null = null;
        const STABILITY_MS = 700; // require content stable for this many ms before considering it initialized
        const SAFETY_TIMEOUT = 7000; // fallback cut-off if widget never appears

        function hasMeaningfulContent(el: HTMLDivElement | null) {
            if (!el) return false;
            // consider meaningful if there is visible text or an anchor or iframe etc.
            const text = el.innerText?.trim();
            if (text && text.length > 0) return true;
            // check for common Trustpilot injected elements
            if (el.querySelector('a, iframe, .tp-widget, .trustpilot-rating')) return true;
            // fallback: child nodes > 0
            return el.childNodes && el.childNodes.length > 0;
        }

        function confirmInitialized() {
            // ensure widgetRef still has meaningful content
            if (hasMeaningfulContent(widgetRef.current)) {
                setInitialized(true);
                // disconnect observer and clear timers
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                if (stabilityTimer) {
                    clearTimeout(stabilityTimer);
                    stabilityTimer = null;
                }
            }
        }

        function tryInit() {
            attempts++;
            const tp = (window as any).Trustpilot;
            // only call loadFromElement when tp is present
            if (tp && widgetRef.current) {
                try {
                    if (typeof tp.loadFromElement === 'function') {
                        tp.loadFromElement(widgetRef.current, true);
                    }
                } catch (e) {
                    // don't mark initialized yet — wait for DOM changes
                }

                // set up observer to detect when TP injects markup
                if (!observer && widgetRef.current) {
                    observer = new MutationObserver(() => {
                        // when mutation detected, wait STABILITY_MS to ensure content is stable
                        if (stabilityTimer) {
                            clearTimeout(stabilityTimer);
                        }
                        stabilityTimer = window.setTimeout(confirmInitialized, STABILITY_MS);
                    });
                    try {
                        observer.observe(widgetRef.current, { childList: true, subtree: true, characterData: true });
                    } catch (e) {
                        // ignore observer errors
                    }
                    // also do an immediate check in case content already present
                    if (hasMeaningfulContent(widgetRef.current)) {
                        stabilityTimer = window.setTimeout(confirmInitialized, STABILITY_MS);
                    }
                }

                // stop polling for the script once we've set up the observer
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            } else if (attempts >= maxAttempts) {
                // Stop polling after max attempts; the safety timeout below may still hide fallback later
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }
        }

        // Start polling for the Trustpilot script to register the global
        interval = window.setInterval(tryInit, 250);
        tryInit();

        // Safety timeout: if widget hasn't initialized after SAFETY_TIMEOUT, show the fallback (avoid permanent spinner)
        const safetyTimer = window.setTimeout(() => {
            if (!initialized) {
                // leave fallback visible (initialized false) but stop attempting
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }
        }, SAFETY_TIMEOUT);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            if (observer) {
                observer.disconnect();
            }
            if (stabilityTimer) {
                clearTimeout(stabilityTimer);
            }
            clearTimeout(safetyTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="trustpilot-wrapper mt-3">
            {/* Trustpilot widget container — script will replace this when loaded.
				Keep the container but render our branded fallback until injected content is stable. */}
            <div
                ref={widgetRef}
                className="trustpilot-widget"
                data-locale="en-GB"
                data-template-id="53aa8807dec7e10d38f59f36"
                // optional: add data-businessunit-id if available
                // data-businessunit-id="YOUR_BUSINESS_UNIT_ID"
                data-style-height="40px"
                data-style-width="100%"
                data-theme="dark"
                role="region"
                aria-label="Trustpilot review widget"
            >
                {/* The actual Trustpilot script will replace this content when available */}
            </div>

            {/* Branded fallback shown only while the Trustpilot widget hasn't initialized */}
            {!initialized && (
                <div
                    className="tp-fallback rounded-md p-3 shadow-sm flex items-center justify-between"
                    role="note"
                    aria-hidden={initialized ? 'true' : 'false'}
                >
                    <div className="flex items-center gap-3">
                        {/* use the real site Logo inside a small badge (force size via wrapper) */}
                        <div className="tp-badge w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-green-600 text-white">
                            <SiTrustpilot size={28} />
                        </div>
                        <div>
                            <div className="text-sm text-white/80">Customer Reviews</div>
                            <div className="flex items-center gap-2">
                                {/* prominent stars and small meta */}
                                <span className="text-yellow-400 leading-none" aria-hidden>
                                    ★★★★
                                </span>
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
