const modules = [
  'SAP FI', 'SAP CO', 'S/4HANA', 'SAP ABAP', 'SAP HANA', 'SAP Fiori', 'SCM',
  'SAP BW', 'SAP MM', 'SAP SD', 'SAP HR', 'SAP PS',
]

// Duplicate for seamless loop
const allModules = [...modules, ...modules]

export default function TrustBar() {
  return (
    <div className="bg-smoke border-y border-amber/10 py-3.5 overflow-hidden">
      <div className="flex items-center">
        {/* Static label */}
        <div className="shrink-0 flex items-center gap-3 pl-6 pr-5 border-r border-amber/10">
          <span className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-amber/50 whitespace-nowrap">
            Moduli SAP
          </span>
        </div>

        {/* Scrolling marquee */}
        <div className="overflow-hidden flex-1">
          <div className="flex marquee-track">
            {allModules.map((m, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="font-mono text-[0.72rem] text-white/35 px-5 whitespace-nowrap hover:text-amber/60 transition-colors cursor-default">
                  {m}
                </span>
                <span className="text-amber/15 text-xs shrink-0">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
