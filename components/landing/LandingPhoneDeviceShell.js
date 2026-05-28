/**
 * Chassi matte — smartphone convencional, sem efeito “mockup cartoon”.
 * @param {object} props
 * @param {ReturnType<import('@/lib/landingPhoneSpecs').getLandingPhoneMetrics>} props.metrics
 * @param {import('react').ReactNode} props.children
 * @returns {import('react').ReactElement}
 */
export default function LandingPhoneDeviceShell({ metrics: m, children }) {
  return (
    <div className="relative" style={{ width: m.outerWidth }}>
      {/* Botões físicos — quase imperceptíveis */}
      <div
        className="absolute -left-px top-[22%] z-10 h-[22px] w-px rounded-l-sm bg-[#1a1a1c]"
        aria-hidden
      />
      <div
        className="absolute -left-px top-[30%] z-10 h-[32px] w-px rounded-l-sm bg-[#1a1a1c]"
        aria-hidden
      />
      <div
        className="absolute -right-px top-[26%] z-10 h-[48px] w-px rounded-r-sm bg-[#1a1a1c]"
        aria-hidden
      />

      {/* Corpo */}
      <div
        className="relative box-border bg-[#2c2c2e]"
        style={{
          width: m.outerWidth,
          borderRadius: m.frameRadius,
          padding: `${PHONE_FRAME_PADDING(m)}px`,
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.06) inset",
            "0 0 0 1px rgba(0,0,0,0.35)",
            "0 25px 50px -12px rgba(0,0,0,0.22)",
            "0 12px 24px -8px rgba(0,0,0,0.12)",
          ].join(", "),
          background: "linear-gradient(145deg, #353538 0%, #2c2c2e 42%, #252528 100%)",
        }}
      >
        {/* Bezel interno */}
        <div
          className="relative bg-black"
          style={{
            width: m.screenWidth,
            height: m.screenHeight,
            margin: "0 auto",
            borderRadius: m.screenRadius,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Câmera frontal (punch-hole) */}
          <div
            className="absolute left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#0a0a0a] ring-1 ring-[#1a1a1a]"
            style={{
              top: m.punch.top,
              width: m.punch.size,
              height: m.punch.size,
              boxShadow: "inset 0 0 2px rgba(0,0,0,0.9)",
            }}
            aria-hidden
          />

          {/* Tela */}
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
                className="rounded-full bg-black/30"
                style={{ width: m.homeIndicator.w, height: m.homeIndicator.h }}
                aria-hidden
              />
            </div>
          </div>

          {/* Reflexo de vidro — único, muito sutil */}
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
            style={{
              borderRadius: m.screenRadius,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 38%, transparent 100%)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {ReturnType<import('@/lib/landingPhoneSpecs').getLandingPhoneMetrics>} m
 * @returns {number}
 */
function PHONE_FRAME_PADDING(m) {
  return (m.outerWidth - m.screenWidth) / 2;
}
