import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {

    let [authStatus, setAuthStatus] = useState("loading")

    useEffect(() => {
        async function checkAuth() {
            try {
                let response = await fetch("https://attendo-h4oc.onrender.com/check-auth", {
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