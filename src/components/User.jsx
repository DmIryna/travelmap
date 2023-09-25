import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import styles from "./User.module.css"

function User() {
  const { user } = useAuth()
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleClick() {
    logout()
    navigate("/")
  }

  if (!user) return null

  return (
    <div className={styles.user}>
      <img src="/defaultUser.png" alt={user.user.name} />
      <span>Welcome, {user.user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  )
}

export default User
