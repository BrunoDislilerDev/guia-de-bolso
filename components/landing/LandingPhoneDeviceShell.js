/**
 * Chassi refinado — Dynamic Island, vidro em camadas, luz de borda (keynote).
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
        className="absolute -left-px top-[22%] z-10 h-[22px] w-px rounded-l-sm bg-gradient-to-b from-[#4a4a4e] to-[#1a1a1c]"
        aria-hidden
      />
      <div
        className="absolute -left-px top-[30%] z-10 h-[32px] w-px rounded-l-sm bg-gradient-to-b from-[#4a4a4e] to-[#1a1a1c]"
        aria-hidden
      />
      <div
        className="absolute -right-px top-[26%] z-10 h-[48px] w-px rounded-r-sm bg-gradient-to-b from-[#4a4a4e] to-[#1a1a1c]"
        aria-hidden
      />

      <div
        className="landing-phone-rim-light relative box-border"
        style={{
          width: m.outerWidth,
          borderRadius: m.frameRadius,
          padding: `${pad}px`,
          background:
            "linear-gradient(155deg, #454548 0%, #323234 22%, #2a2a2c 48%, #232325 72%, #1a1a1c 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit]"
          style={{
            borderRadius: m.frameRadius,
            background:
              "linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 18%, transparent 42%)",
          }}
          aria-hidden
        />

        <div
          className="relative bg-[#000000]"
          style={{
            width: m.screenWidth,
            height: m.screenHeight,
            margin: "0 auto",
            borderRadius: m.screenRadius,
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="absolute left-1/2 z-30 -translate-x-1/2 bg-black"
            style={{
              top: m.island.top,
              width: m.island.w,
              height: m.island.h,
              borderRadius: m.island.h,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.65), inset 0 0.5px 0 rgba(255,255,255,0.06)",
            }}
            aria-hidden
          >
            <span
              className="absolute right-[18%] top-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0c]"
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
                  "linear-gradient(128deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 20%, transparent 46%, rgba(255,255,255,0.02) 78%, rgba(255,255,255,0.06) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                borderRadius: m.screenRadius,
                boxShadow:
                  "inset 0 0 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1), inset 1px 0 0 rgba(255,255,255,0.04)",
              }}
            />
            <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.08]" />
          </div>
        </div>
      </div>
    </div>
  );
}
