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
                width: 900 * 2,
                height: 900 * 2,
                phi: 0,
                theta: 0,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.2588, 0.8275, 0.5725],
                markerColor: [0.2588, 0.8275, 0.5725],
                glowColor: [0.2588, 0.8275, 0.5725],
                markers: [],
                onRender: (state) => {
                    state.phi = phi;
                    phi += 0.01;
                },
            });

            return () => {
                globe.destroy();
            };
        }
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" {...props} />;
};