import { AuthProvider } from "./auth/AuthContext"
import AppRoutes from "./routers/appRotes"

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
export default App
