import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: 'Privacy Policy',
    description: isEn
      ? 'Information on the processing of personal data pursuant to GDPR.'
      : 'Informativa sul trattamento dei dati personali ai sensi del GDPR.',
    robots: { index: false, follow: false },
  }
}

const it = {
  title: 'Privacy Policy',
  updated: 'Ultimo aggiornamento: febbraio 2026',
  intro:
    'La presente informativa descrive come TooSkill (brand di Sigest S.r.l.) raccoglie, utilizza e protegge i dati personali degli utenti che visitano il sito tooskill.it o compilano i moduli di contatto, nel rispetto del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 e s.m.i.',
  sections: [
    {
      title: '1. Titolare del trattamento',
      content: [
        'Sigest S.r.l.',
        'P.IVA: IT00000000000',
        'Sede legale: [Indirizzo completo]',
        'E-mail: privacy@sigestconsulting.com',
        'Sito web: https://sigestconsulting.com',
      ],
    },
    {
      title: '2. Dati personali raccolti',
      content: [
        'Raccogliamo i seguenti dati esclusivamente tramite i moduli presenti sul sito (modulo di contatto e richiesta informazioni corsi):',
        '• Nome e cognome (obbligatorio)',
        '• Indirizzo e-mail (obbligatorio)',
        '• Numero di telefono (facoltativo)',
        '• Nome dell\'azienda (facoltativo)',
        '• Messaggio liberamente inserito dall\'utente',
        'Non vengono raccolti dati sensibili, categorie particolari di dati ex art. 9 GDPR, né dati di minori.',
      ],
    },
    {
      title: '3. Finalità e base giuridica del trattamento',
      content: [
        'I dati vengono trattati per le seguenti finalità:',
        '• Rispondere alle richieste di informazioni e contatto inviate tramite il sito — Base giuridica: esecuzione di misure precontrattuali su richiesta dell\'interessato (art. 6(1)(b) GDPR)',
        '• Invio di comunicazioni commerciali relative ai nostri corsi SAP, previo consenso esplicito — Base giuridica: consenso (art. 6(1)(a) GDPR)',
        '• Adempimento di obblighi legali e fiscali — Base giuridica: obbligo legale (art. 6(1)(c) GDPR)',
      ],
    },
    {
      title: '4. Modalità e periodo di conservazione',
      content: [
        'I dati vengono trattati con strumenti informatici e conservati in modo sicuro. Il periodo di conservazione è pari a:',
        '• 24 mesi dalla ricezione dell\'ultima comunicazione, per le richieste di contatto non sfociate in rapporto contrattuale',
        '• 10 anni dalla chiusura del rapporto contrattuale, ove applicabile, per adempimenti fiscali e legali',
        'Trascorso tale periodo, i dati vengono cancellati o resi anonimi.',
      ],
    },
    {
      title: '5. Destinatari dei dati',
      content: [
        'I dati personali non vengono venduti a terzi. Possono essere comunicati a:',
        '• Fornitori di servizi tecnici che trattano i dati per conto di TooSkill (responsabili del trattamento), tra cui:',
        '  — Supabase Inc. (archiviazione dati, USA) — soggetto a clausole contrattuali standard ex art. 46 GDPR',
        '  — Resend Inc. (invio e-mail transazionali, USA) — soggetto a clausole contrattuali standard ex art. 46 GDPR',
        '• Autorità pubbliche e organi di controllo, ove richiesto dalla legge applicabile',
      ],
    },
    {
      title: '6. Trasferimento dei dati extra-UE',
      content: [
        'Alcuni fornitori tecnici operano al di fuori dello Spazio Economico Europeo. Tali trasferimenti avvengono nel rispetto delle garanzie previste dagli artt. 44-49 GDPR (clausole contrattuali standard approvate dalla Commissione Europea o decisioni di adeguatezza).',
      ],
    },
    {
      title: '7. Diritti dell\'interessato',
      content: [
        'In qualità di interessato, hai il diritto di:',
        '• Accedere ai tuoi dati personali (art. 15 GDPR)',
        '• Rettificare dati inesatti (art. 16 GDPR)',
        '• Ottenere la cancellazione ("diritto all\'oblio") (art. 17 GDPR)',
        '• Richiedere la limitazione del trattamento (art. 18 GDPR)',
        '• Ricevere i dati in formato strutturato (portabilità) (art. 20 GDPR)',
        '• Opporti al trattamento (art. 21 GDPR)',
        '• Revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento svolto prima della revoca',
        'Per esercitare i tuoi diritti, scrivi a: privacy@sigestconsulting.com',
        'Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).',
      ],
    },
    {
      title: '8. Cookie e tecnologie di tracciamento',
      content: [
        'Il sito non utilizza cookie di profilazione o tracciamento di terze parti. Vengono utilizzati esclusivamente cookie tecnici necessari al funzionamento del sito (sessione, preferenze di lingua), che non richiedono il consenso ai sensi dell\'art. 122 D.Lgs. 196/2003.',
      ],
    },
    {
      title: '9. Modifiche alla presente informativa',
      content: [
        'Ci riserviamo il diritto di aggiornare questa informativa in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento. In caso di modifiche sostanziali che riguardino i tuoi dati, riceverai una comunicazione via e-mail.',
      ],
    },
  ],
}

const en = {
  title: 'Privacy Policy',
  updated: 'Last updated: February 2026',
  intro:
    'This notice describes how TooSkill (a brand of Sigest S.r.l.) collects, uses and protects the personal data of users who visit tooskill.it or fill in contact forms, in accordance with EU Regulation 2016/679 (GDPR).',
  sections: [
    {
      title: '1. Data Controller',
      content: [
        'Sigest S.r.l.',
        'VAT: IT00000000000',
        'Registered office: [Full address]',
        'E-mail: privacy@sigestconsulting.com',
        'Website: https://sigestconsulting.com',
      ],
    },
    {
      title: '2. Personal data collected',
      content: [
        'We collect the following data exclusively through the forms on this site (contact and course enquiry forms):',
        '• Full name (required)',
        '• Email address (required)',
        '• Phone number (optional)',
        '• Company name (optional)',
        '• Freely entered message',
        'We do not collect sensitive data, special categories of data (Art. 9 GDPR), or data relating to minors.',
      ],
    },
    {
      title: '3. Purposes and legal basis for processing',
      content: [
        'Data is processed for the following purposes:',
        '• Responding to enquiries submitted via the site — Legal basis: pre-contractual measures at the request of the data subject (Art. 6(1)(b) GDPR)',
        '• Sending marketing communications about our SAP courses, subject to explicit consent — Legal basis: consent (Art. 6(1)(a) GDPR)',
        '• Compliance with legal and fiscal obligations — Legal basis: legal obligation (Art. 6(1)(c) GDPR)',
      ],
    },
    {
      title: '4. Retention period',
      content: [
        'Data is retained securely for:',
        '• 24 months from the last communication, for contact requests that did not result in a contract',
        '• 10 years from contract closure, where applicable, for fiscal and legal obligations',
        'After this period, data is deleted or anonymised.',
      ],
    },
    {
      title: '5. Recipients of personal data',
      content: [
        'Your personal data will not be sold to third parties. It may be shared with:',
        '• Technical service providers acting as data processors on behalf of TooSkill, including:',
        '  — Supabase Inc. (data storage, USA) — subject to standard contractual clauses under Art. 46 GDPR',
        '  — Resend Inc. (transactional email, USA) — subject to standard contractual clauses under Art. 46 GDPR',
        '• Public authorities and supervisory bodies, where required by applicable law',
      ],
    },
    {
      title: '6. International transfers',
      content: [
        'Some technical providers operate outside the European Economic Area. Such transfers comply with the safeguards set out in Arts. 44–49 GDPR (standard contractual clauses approved by the European Commission or adequacy decisions).',
      ],
    },
    {
      title: "7. Your rights",
      content: [
        'As a data subject, you have the right to:',
        '• Access your personal data (Art. 15 GDPR)',
        '• Rectify inaccurate data (Art. 16 GDPR)',
        '• Obtain erasure ("right to be forgotten") (Art. 17 GDPR)',
        '• Request restriction of processing (Art. 18 GDPR)',
        '• Receive data in a structured format (portability) (Art. 20 GDPR)',
        '• Object to processing (Art. 21 GDPR)',
        '• Withdraw consent at any time, without affecting the lawfulness of processing carried out before withdrawal',
        'To exercise your rights, write to: privacy@sigestconsulting.com',
        'You also have the right to lodge a complaint with your local supervisory authority.',
      ],
    },
    {
      title: '8. Cookies and tracking technologies',
      content: [
        'This site does not use profiling or third-party tracking cookies. Only strictly necessary technical cookies are used (session, language preferences), which do not require consent.',
      ],
    },
    {
      title: '9. Changes to this policy',
      content: [
        'We reserve the right to update this policy at any time. Changes will be posted on this page with the date of last update.',
      ],
    },
  ],
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  const content = locale === 'en' ? en : it

  return (
    <div style={{ background: '#131210' }}>
      {/* Header */}
      <section className="relative overflow-hidden" style={{ background: '#09080A' }}>
        {/* Amber rule top */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.4), transparent)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 text-center">
          <p
            className="font-mono text-[0.58rem] tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(212,151,58,0.50)' }}
          >
            — Legal
          </p>
          <h1
            className="font-display font-extrabold text-white leading-tight tracking-[-0.02em] mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            {content.title}
          </h1>
          <p
            className="font-mono text-[0.58rem] tracking-[0.18em] uppercase"
            style={{ color: 'rgba(156,148,136,0.35)' }}
          >
            {content.updated}
          </p>
        </div>

        {/* Amber rule bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.15), transparent)',
          }}
        />
      </section>

      {/* Content */}
      <section style={{ background: '#131210' }}>
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
          {/* Intro block */}
          <div
            className="p-7 mb-8"
            style={{
              background: 'rgba(30,27,20,0.4)',
              border: '1px solid rgba(212,151,58,0.12)',
              borderLeft: '2px solid rgba(212,151,58,0.45)',
            }}
          >
            <p className="text-stone text-sm leading-relaxed">{content.intro}</p>
          </div>

          {/* Sections */}
          <div style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}>
            {content.sections.map((section, i) => (
              <div
                key={i}
                className="py-8"
                style={{ borderBottom: '1px solid rgba(212,151,58,0.10)' }}
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span
                    className="font-mono text-[0.56rem] tracking-[0.22em] uppercase shrink-0"
                    style={{ color: 'rgba(212,151,58,0.30)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2
                    className="font-display font-bold text-white/85"
                    style={{ fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)' }}
                  >
                    {section.title.replace(/^\d+\.\s*/, '')}
                  </h2>
                </div>
                <div className="space-y-2 pl-10">
                  {section.content.map((line, j) => (
                    <p key={j} className="text-stone text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-10 py-8 text-center" style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}>
            <p
              className="font-mono text-[0.58rem] tracking-[0.2em] uppercase mb-3"
              style={{ color: 'rgba(156,148,136,0.45)' }}
            >
              {locale === 'en'
                ? 'Questions about your privacy?'
                : 'Domande sulla tua privacy?'}
            </p>
            <a
              href="mailto:privacy@sigestconsulting.com"
              className="font-display font-bold text-sm transition-colors duration-200 text-[#D4973A] hover:text-[#F5C97A]"
            >
              privacy@sigestconsulting.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
