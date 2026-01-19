import { AuthProvider } from "./auth/AuthContext"
import { DashboardProvider } from "./auth/DashboardContext"
import AppRoutes from "./routers/appRoutes"

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </AuthProvider>
  )
}
export default App
