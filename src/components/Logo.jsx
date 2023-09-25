import { Link } from "react-router-dom"
import styles from "./Logo.module.css"

function Logo() {
  return (
    <div>
      <Link to="/" className={styles.logoLink}>
        <img src="/logo.png" alt="TravelMap logo" className={styles.logo} />
        <h4>TravelMap</h4>
      </Link>
    </div>
  )
}

export default Logo
