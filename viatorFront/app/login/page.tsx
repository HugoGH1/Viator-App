"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { authAPI } from "@/lib/auth-api"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()
    const { setSession } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")
        setIsLoading(true)
        
        try {
            const response = await authAPI.login(email, password)
            setSession(response)
            router.push("/")
        } catch (error: any) {
            console.error("Login error:", error)
            setErrorMsg(error.message || "Credenciales inválidas")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark-blue flex flex-col">
            <header className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-action-green" />
                    <span className="text-xl font-bold text-very-light-beige">Viator</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md">
                    {/* Welcome Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-very-light-beige mb-2">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-light-beige">
                            Inicia sesion para continuar explorando
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    {/* Inicio de Sesión */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-light-beige">
                                Correo electronico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light-beige" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 bg-medium-blue border-medium-blue-accent text-very-light-beige placeholder:text-light-beige/50 rounded-xl focus:border-action-green focus:ring-action-green"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-light-beige">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light-beige" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Tu contrasena"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 h-14 bg-medium-blue border-medium-blue-accent text-very-light-beige placeholder:text-light-beige/50 rounded-xl focus:border-action-green focus:ring-action-green"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-light-beige hover:text-very-light-beige transition-colors"
                                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Ingresar */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-action-green hover:bg-action-green/90 text-dark-blue font-semibold rounded-xl text-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
                        </Button>
                    </form>

                    {/* Crear cuenta */}
                    <p className="text-center mt-8 text-light-beige">
                        No tienes una cuenta?{" "}
                        <Link
                            href="/signup"
                            className="text-action-green font-semibold hover:underline"
                        >
                            Registrate
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}