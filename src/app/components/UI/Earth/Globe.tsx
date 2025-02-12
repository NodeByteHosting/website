"use client";

import { ComponentPropsWithoutRef, useEffect, useRef } from "react";
import createGlobe from "cobe";

export function CobeGlobe(props: ComponentPropsWithoutRef<"canvas">) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current == null) return;
        let phi = 0;

        if (canvasRef.current) {
            const globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: 600 * 2,
                height: 600 * 2,
                phi: 0,
                theta: 0,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.2588, 0.8275, 0.5725],
                markerColor: [1.0, 1.0, 1.0],
                glowColor: [0.2588, 0.8275, 0.5725],
                markers: [
                    // locations are [latitude, longitude]
                    { location: [51.1657, 10.4515], size: 0.07 },
                    { location: [55.3781, -3.4360], size: 0.07 }
                ],
                onRender: (state) => {
                    state.phi = phi;
                    phi += 0.01;
                }
            });

            return () => {
                globe.destroy();
            };
        }
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" {...props} />;
};