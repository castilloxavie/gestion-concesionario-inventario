import { AppRouter } from "./routes/appRouter";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"

function App() {
  return (
    <AuthProvider >
      <AppRouter />
    </AuthProvider>
    
  )
}

export default App;