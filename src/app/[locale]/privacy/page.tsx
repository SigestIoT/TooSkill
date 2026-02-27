import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy',
    description: 'Informativa sul trattamento dei dati personali ai sensi del GDPR.',
    robots: { index: false },
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
    <div>
      {/* Header */}
      <section className="py-20 mesh-bg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #4F6EF7 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">
            {content.title}
          </h1>
          <p className="text-white/40 text-sm">{content.updated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="bg-white rounded-2xl border border-border p-8 mb-8 shadow-sm">
            <p className="text-muted-text leading-relaxed text-sm">{content.intro}</p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {content.sections.map((section, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                <h2 className="font-display font-bold text-deep text-lg mb-4">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.content.map((line, j) => (
                    <p key={j} className="text-muted-text text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 text-center">
            <p className="text-sm text-deep font-medium mb-1">
              {locale === 'en'
                ? 'Questions about your privacy?'
                : 'Domande sulla tua privacy?'}
            </p>
            <a
              href="mailto:privacy@sigestconsulting.com"
              className="text-brand-primary text-sm font-semibold hover:underline"
            >
              privacy@sigestconsulting.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
