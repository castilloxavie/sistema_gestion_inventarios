import { AuthProvider } from "./auth/AuthContext"
import AppRoutes from "./routers/appRoutes"

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
export default App
