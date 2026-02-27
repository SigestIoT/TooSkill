import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TooSkill — Formazione SAP Professionale'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #060B18 0%, #0D1B2A 50%, #0A1628 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(79,110,247,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800 }}>
            <span style={{ color: '#ffffff' }}>Too</span>
            <span style={{ color: '#4F6EF7' }}>Skill</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '-0.02em',
            }}
          >
            Formazione SAP Professionale
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {['FI', 'CO', 'S/4HANA', 'ABAP', 'Fiori'].map((m) => (
              <div
                key={m}
                style={{
                  background: 'rgba(79,110,247,0.2)',
                  border: '1px solid rgba(79,110,247,0.4)',
                  borderRadius: 8,
                  padding: '6px 16px',
                  color: '#8BA4FF',
                  fontSize: 18,
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            A Sigest Consulting brand
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
