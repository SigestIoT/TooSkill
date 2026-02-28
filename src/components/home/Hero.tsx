'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const statsData = [
  { value: '20+', key: 'years' },
  { value: '100+', key: 'projects' },
  { value: '10+', key: 'countries' },
]

// SAP module badges positioned on a circle (r=180, centre=210,210)
const orbitModules = [
  { label: 'FI',      x: 210,  y: 30   }, // 12 o'clock
  { label: 'CO',      x: 355,  y: 105  }, // ~2
  { label: 'S/4HANA', x: 380,  y: 275  }, // ~4
  { label: 'ABAP',    x: 275,  y: 378  }, // ~5
  { label: 'HANA',    x: 145,  y: 378  }, // ~7
  { label: 'Fiori',   x: 42,   y: 275  }, // ~8
  { label: 'SCM',     x: 65,   y: 105  }, // ~10
]

export default function Hero() {
  const t = useTranslations('hero')
  const ts = useTranslations('stats')

  return (
    <section className="relative min-h-screen bg-void grain overflow-hidden flex items-center">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-overlay opacity-100 pointer-events-none" />

      {/* Ambient warm glow — left */}
      <div
        className="absolute top-0 left-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 10% 30%, rgba(212,151,58,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 xl:gap-16 items-center pt-28 pb-16 lg:min-h-screen">

          {/* ── LEFT: Editorial content ── */}
          <div>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-amber/70">
                {t('badge')}
              </span>
              <span className="block h-px w-12 bg-amber/20" />
            </motion.div>

            {/* Headline — massive Syne uppercase */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="font-display font-extrabold leading-[0.9] tracking-tight text-white uppercase"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)' }}
              >
                {t('headline_before')}
              </h1>
              {/* Italic serif line — the amber accent */}
              <p
                className="font-serif italic text-amber leading-[1.05] mt-2 mb-10"
                style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}
              >
                {t('headline_highlight')}.
              </p>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-white/45 text-base sm:text-lg max-w-[480px] leading-relaxed mb-12"
            >
              {t('subheadline')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <Link
                href="/corsi"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-amber text-void font-display font-bold text-[0.8rem] uppercase tracking-[0.12em] hover:bg-amber-light transition-colors duration-200 group"
              >
                {t('cta_primary')}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/60 font-display font-bold text-[0.8rem] uppercase tracking-[0.12em] hover:border-amber/40 hover:text-amber/80 transition-colors duration-200"
              >
                {t('cta_secondary')}
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.52 }}
              className="flex items-stretch gap-8 sm:gap-12"
            >
              {statsData.map((s, i) => (
                <div key={s.key} className="flex flex-col">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-amber leading-none">
                    {s.value}
                  </span>
                  <span className="font-mono text-[0.65rem] text-white/35 mt-1.5 tracking-wider uppercase">
                    {ts(s.key)}
                  </span>
                  {i < statsData.length - 1 && (
                    <div className="hidden sm:block absolute w-px h-10 bg-white/8" style={{ marginLeft: '5rem' }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: SAP orbit ring ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[420px] h-[420px]">

              {/* Ambient glow */}
              <div
                className="absolute inset-[-20px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(212,151,58,0.08) 0%, transparent 72%)' }}
              />

              {/* Outer ring — slow spin */}
              <div
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{ border: '1px solid rgba(212,151,58,0.18)' }}
              />

              {/* Dashed inner ring — counter-spin */}
              <div
                className="absolute inset-[40px] rounded-full animate-spin-slow-ccw"
                style={{ border: '1px dashed rgba(212,151,58,0.10)' }}
              />

              {/* Static inner circle */}
              <div
                className="absolute inset-[80px] rounded-full"
                style={{ border: '1px solid rgba(212,151,58,0.14)' }}
              />

              {/* Centre label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="font-display font-extrabold text-5xl text-amber/70 tracking-tight leading-none">
                  SAP
                </span>
                <span className="font-mono text-[0.55rem] tracking-[0.25em] text-amber/30 uppercase">
                  Training
                </span>
              </div>

              {/* Orbiting module badges */}
              {orbitModules.map(({ label, x, y }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: 'backOut' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  <span
                    className="inline-block font-mono text-[0.68rem] font-bold text-amber px-2.5 py-1 whitespace-nowrap"
                    style={{
                      background: 'rgba(212,151,58,0.08)',
                      border: '1px solid rgba(212,151,58,0.22)',
                    }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}

              {/* Corner tick marks */}
              {[0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180
                const r = 208
                const cx = 210 + r * Math.cos(rad - Math.PI / 2)
                const cy = 210 + r * Math.sin(rad - Math.PI / 2)
                return (
                  <div
                    key={angle}
                    className="absolute w-2.5 h-px bg-amber/30 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: cx, top: cy, transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                  />
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-6 lg:left-8 flex items-center gap-3 pointer-events-none"
      >
        <div className="w-8 h-px bg-amber/25" />
        <span className="font-mono text-[0.6rem] tracking-[0.25em] text-white/25 uppercase">Scroll</span>
      </motion.div>

      {/* Bottom amber rule */}
      <div className="absolute bottom-0 left-0 right-0 amber-rule" />
    </section>
  )
}
