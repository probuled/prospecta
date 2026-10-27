import { ArrowLeft, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { StatusScreen } from '@/presentation/components/status-screen'

export function NotFoundPage() {
  const { pathname, key } = useLocation()
  // "default" é a primeira entrada do histórico: aberto direto pelo endereço, não há para onde voltar.
  const canGoBack = key !== 'default'
  const navigate = useNavigate()

  return (
    <StatusScreen
      code="404"
      title="Página não encontrada"
      description={
        <p>
          O endereço <span className="font-mono break-all text-ink">{pathname}</span> não existe no Prospecta. Pode ter sido digitado errado
          ou vindo de um link antigo.
        </p>
      }
      actions={
        <>
          <ButtonLink to={ROUTES.search} variant="primary">
            <Search /> Ir para a busca
          </ButtonLink>
          {canGoBack && (
            <Button icon={ArrowLeft} onClick={() => navigate(-1)}>
              Voltar
            </Button>
          )}
        </>
      }
    />
  )
}
