import { RotateCw, Search } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { StatusScreen } from './status-screen'

/** `errorElement` das rotas: aparece quando uma tela quebra, sem depender do layout. Endereço desconhecido é a rota `*`. */
export function RouteError() {
  return (
    <StatusScreen
      hero={<p className="text-6xl leading-none font-black tracking-tight text-ouro-text">Ops</p>}
      title="Algo deu errado nesta tela"
      description={<p>Seus leads e buscas continuam salvos neste navegador. Recarregue a página ou volte para a busca.</p>}
      actions={
        <>
          <ButtonLink to={ROUTES.search} variant="primary" size="lg" reloadDocument>
            <Search /> Ir para a busca
          </ButtonLink>
          <Button size="lg" icon={RotateCw} onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </>
      }
    />
  )
}
