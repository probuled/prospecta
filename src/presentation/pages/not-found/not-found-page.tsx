import { Search } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { ButtonLink } from '@/components/prospecta/button'
import { StatusScreen } from '@/presentation/components/status-screen'
import { NotFoundCode } from './not-found-code'

export function NotFoundPage() {
  return (
    <StatusScreen
      hero={<NotFoundCode />}
      title="Essa página saiu do funil"
      description={
        <p>Erro 404: o endereço que você abriu não existe no Prospecta. Pode ter sido digitado errado ou vindo de um link antigo.</p>
      }
      actions={
        <>
          <ButtonLink to={ROUTES.search} variant="primary" size="lg">
            <Search /> Buscar leads de verdade
          </ButtonLink>
          <ButtonLink to={ROUTES.leads} size="lg" className="border-line-strong">
            Ver meus leads
          </ButtonLink>
        </>
      }
    />
  )
}
