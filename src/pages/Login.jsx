import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import PageNav from "../components/PageNav"
import Button from "../components/Button"
import styles from "./Login.module.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login, isAuthenticated, error, user, initialRender } = useAuth()
  const navigate = useNavigate()
  const userId = user?.user?._id

  useEffect(() => {
    initialRender()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email && password) login(email, password)
  }

  useEffect(() => {
    if (isAuthenticated) navigate(`/app/${userId}`, { replace: true })
  }, [isAuthenticated, navigate, userId])

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className={styles.btns}>
          <Button type="primary">Login</Button>
          <Button type="secondary" onClick={() => navigate("/register")}>
            New to TravelMap? Sign up
          </Button>
        </div>
      </form>
    </main>
  )
}
