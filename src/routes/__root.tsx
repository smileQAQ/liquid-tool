import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { CounterProvider } from '../components/mainProvider'
import { MainStore } from '../store/main'

// 创建一个 store 实例
const store = new MainStore()

export const Route = createRootRoute({
  component: () => (
    <>
      <CounterProvider store={store}>
        <Outlet />
        <TanStackRouterDevtools />
      </CounterProvider>
    </>
  ),
})