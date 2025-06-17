import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {

    let [authStatus, setAuthStatus] = useState("loading")

    useEffect(() => {
        async function checkAuth() {
            try {
                let response = await fetch("http://localhost:8000/check-auth", {
                    method: "GET",
                    credentials: "include"
                })
                let data = await response.json()
                if (data.authenticated) {
                    setAuthStatus("authenticated")
                }
                else {
                    setAuthStatus("unauthenticated")
                }
            }
            catch (error) {
                setAuthStatus("unauthenticated")
            }
        }
        checkAuth()
    }, [])

    if (authStatus === "loading") {
        return <div>Loading...</div>
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />
    }

    return children;
}