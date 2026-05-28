/**
 * Chassi refinado — Dynamic Island proporcional, vidro em camadas, luz de borda.
 * @param {object} props
 * @param {ReturnType<import('@/lib/landingPhoneSpecs').getLandingPhoneMetrics>} props.metrics
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
export default function LandingPhoneDeviceShell({ metrics: m, children }) {
  const pad = (m.outerWidth - m.screenWidth) / 2;

  return (
    <div className="relative" style={{ width: m.outerWidth }}>
      <div
        className="absolute -left-px top-[22%] z-10 h-[22px] w-px rounded-l-sm bg-[#252528]"
        aria-hidden
      />
      <div
        className="absolute -left-px top-[30%] z-10 h-[32px] w-px rounded-l-sm bg-[#252528]"
        aria-hidden
      />
      <div
        className="absolute -right-px top-[26%] z-10 h-[48px] w-px rounded-r-sm bg-[#252528]"
        aria-hidden
      />

      <div
        className="relative box-border"
        style={{
          width: m.outerWidth,
          borderRadius: m.frameRadius,
          padding: `${pad}px`,
          background:
            "linear-gradient(160deg, #3d3d40 0%, #2c2c2e 35%, #242426 70%, #1f1f21 100%)",
          boxShadow: [
            "0 0 0 0.5px rgba(255,255,255,0.1) inset",
            "0 0 0 1px rgba(0,0,0,0.4)",
            "0 28px 56px -14px rgba(0,0,0,0.24)",
            "0 10px 20px -6px rgba(0,0,0,0.1)",
          ].join(", "),
        }}
      >
        <div
          className="relative bg-[#000000]"
          style={{
            width: m.screenWidth,
            height: m.screenHeight,
            margin: "0 auto",
            borderRadius: m.screenRadius,
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 z-30 -translate-x-1/2 bg-black"
            style={{
              top: m.island.top,
              width: m.island.w,
              height: m.island.h,
              borderRadius: m.island.h,
              boxShadow:
                "0 0.5px 1px rgba(0,0,0,0.6), inset 0 0.5px 0 rgba(255,255,255,0.05)",
            }}
            aria-hidden
          >
            <span
              className="absolute right-[18%] top-1/2 -translate-y-1/2 rounded-full bg-[#0d0d0f]"
              style={{
                width: Math.max(4, Math.round(m.island.h * 0.36)),
                height: Math.max(4, Math.round(m.island.h * 0.36)),
                boxShadow: "inset 0 0 1px rgba(0,0,0,0.9)",
              }}
            />
          </div>

          <div
            className="relative flex h-full flex-col overflow-hidden bg-[#f0f4f3]"
            style={{
              borderRadius: m.screenRadius,
              paddingTop: m.safeTop,
            }}
          >
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            <div className="relative z-10 flex shrink-0 justify-center bg-[#f0f4f3] pb-2 pt-0.5">
              <div
                className="rounded-full bg-black/28"
                style={{ width: m.homeIndicator.w, height: m.homeIndicator.h }}
                aria-hidden
              />
            </div>
          </div>

          {/* Vidro — camadas */}
          <div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ borderRadius: m.screenRadius }}
            aria-hidden
          >
            <div
              className="absolute inset-0"
              style={{
                borderRadius: m.screenRadius,
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 22%, transparent 48%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                borderRadius: m.screenRadius,
                boxShadow: "inset 0 0 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            />
            <div
              className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.06]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
