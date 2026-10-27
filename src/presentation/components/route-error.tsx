import { RotateCw, Search } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { Logo } from '@/components/prospecta/logo'
import { StatusScreen } from './status-screen'

/** `errorElement` da raiz: aparece quando uma tela quebra ou a rota falha, sem depender do layout. */
export function RouteError() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="min-h-dvh bg-bg px-4 py-10">
      <div className="flex justify-center">
        <Logo height={40} />
      </div>
      <StatusScreen
        code={isNotFound ? '404' : 'Ops'}
        title={isNotFound ? 'Página não encontrada' : 'Algo deu errado nesta tela'}
        description={
          <p>
            {isNotFound
              ? 'Esse endereço não existe no Prospecta.'
              : 'Seus leads e buscas continuam salvos neste navegador. Recarregue a página ou volte para a busca.'}
          </p>
        }
        actions={
          <>
            <ButtonLink to={ROUTES.search} variant="primary" reloadDocument>
              <Search /> Ir para a busca
            </ButtonLink>
            {!isNotFound && (
              <Button icon={RotateCw} onClick={() => window.location.reload()}>
                Recarregar
              </Button>
            )}
          </>
        }
      />
    </main>
  )
}
