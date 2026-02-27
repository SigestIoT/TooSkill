import { Badge } from '@/components/ui/badge'

const modules = ['SAP FI', 'SAP CO', 'S/4HANA', 'SAP ABAP', 'SAP HANA', 'SAP Fiori', 'Supply Chain']

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-border py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <p className="text-muted-text text-xs font-semibold uppercase tracking-wider shrink-0">
            Moduli coperti
          </p>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {modules.map((m) => (
              <Badge
                key={m}
                variant="secondary"
                className="bg-brand-primary/8 text-brand-primary border border-brand-primary/20 text-xs font-medium"
              >
                {m}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
