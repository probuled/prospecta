import { HardDrive, MapPinned, MessageCircleWarning, Scale, ShieldCheck, type LucideIcon } from 'lucide-react'

export interface ResponsibleUseNotice {
  readonly id: string
  readonly icon: LucideIcon
  readonly title: string
  readonly summary: string
  readonly tips: readonly string[]
}

/** Riscos de usar o Prospecta e como evitá-los. Mesmo conteúdo das seções Aviso e Cuidados do README. */
export const RESPONSIBLE_USE_NOTICES: readonly ResponsibleUseNotice[] = [
  {
    id: 'local',
    icon: HardDrive,
    title: 'Rode só no seu computador',
    summary:
      'O Prospecta foi feito para uso local e pessoal. O motor de busca não tem senha: publicado na internet, qualquer pessoa poderia usá-lo para raspar o Google em seu nome.',
    tips: [
      'Deixe as portas presas ao 127.0.0.1, como vem no docker-compose.yml.',
      'Não ofereça o Prospecta como serviço para outras pessoas.',
    ],
  },
  {
    id: 'google',
    icon: MapPinned,
    title: 'Google Maps: proibido pelos termos',
    summary:
      'Raspar o Google Maps não é crime, mas vai contra os Termos de Serviço do Google, que proíbem coleta automatizada. Se a busca exagerar, o Google bloqueia o seu IP por um tempo ou passa a pedir captcha. Sua conta Google não é afetada: o motor não faz login.',
    tips: [
      'Faça uma busca por vez, com poucos negócios.',
      'Não venda, não republique e não compartilhe as listas raspadas.',
      'Se as buscas começarem a falhar, espere algumas horas antes de tentar de novo.',
    ],
  },
  {
    id: 'whatsapp',
    icon: MessageCircleWarning,
    title: 'WhatsApp: nada de disparo em massa',
    summary:
      'O WhatsApp proíbe mensagens em massa ou automáticas. Quando muita gente bloqueia ou denuncia o seu número, ele é banido, às vezes de vez. O Prospecta abre uma conversa por vez para você revisar e enviar.',
    tips: [
      'Mande poucas mensagens por dia, sobretudo com número novo.',
      'Personalize cada mensagem; texto idêntico para muita gente parece spam.',
      'Não insista: sem resposta, no máximo um retorno educado.',
      'Não use ferramentas de disparo automático.',
    ],
  },
  {
    id: 'lgpd',
    icon: ShieldCheck,
    title: 'LGPD: telefone e e-mail são dados pessoais',
    summary:
      'Em negócio pequeno, MEI ou autônomo, o telefone e o e-mail costumam ser da própria pessoa. A LGPD vale para eles, mesmo sendo públicos no Google.',
    tips: [
      'Diga como encontrou o contato e por que está escrevendo.',
      'Quem pedir para não ser contatado sai da lista: marque como Perdido e anote o motivo.',
      'Guarde só o necessário e não repasse a lista para ninguém.',
    ],
  },
  {
    id: 'responsabilidade',
    icon: Scale,
    title: 'A responsabilidade é de quem usa',
    summary:
      'O Prospecta é um projeto de estudo, sem vínculo com o Google, e vem sem garantia (licença MIT). Respeitar os termos do Google, as regras do WhatsApp e a LGPD cabe a quem roda o projeto.',
    tips: [],
  },
]
