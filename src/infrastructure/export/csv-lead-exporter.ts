import Papa from 'papaparse'
import type { LeadExporter } from '@/application/ports/lead-exporter'
import { LEAD_STATUS_LABELS, type Lead } from '@/domain/lead'
import { evaluateOpportunity } from '@/domain/opportunity'
import { parsePhone } from '@/domain/phone'
import { classifyWebsite, WEBSITE_PRESENCE_LABELS } from '@/domain/website-presence'
import { downloadFile } from './download-file'

function toRow(lead: Lead) {
  const opportunity = evaluateOpportunity(lead)
  return {
    Nome: lead.name,
    Categoria: lead.category,
    Telefone: lead.phone,
    WhatsApp: parsePhone(lead.phone)?.isMobile ? 'sim' : 'não',
    Email: lead.emails.join(', '),
    Site: lead.website,
    Presença: WEBSITE_PRESENCE_LABELS[classifyWebsite(lead.website)],
    Nota: lead.rating ?? '',
    Avaliações: lead.reviewCount,
    Endereço: lead.address,
    Cidade: lead.city,
    Oportunidade: `${opportunity.level} (${opportunity.score})`,
    Status: LEAD_STATUS_LABELS[lead.status],
    'Valor (R$)': lead.dealValue ?? '',
    'Próximo contato': lead.followUpAt ? new Date(lead.followUpAt).toLocaleString('pt-BR') : '',
    Notas: lead.notes,
    'Google Maps': lead.mapsUrl,
  }
}

export class CsvLeadExporter implements LeadExporter {
  export(leads: readonly Lead[], fileName: string): void {
    // BOM para o Excel abrir acentos corretamente.
    const csv = '﻿' + Papa.unparse(leads.map(toRow))
    downloadFile(new Blob([csv], { type: 'text/csv;charset=utf-8' }), fileName)
  }
}
