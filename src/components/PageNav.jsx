import { NavLink, Link } from "react-router-dom"
import Logo from "./Logo"
import styles from "./PageNav.module.css"

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/pricing">Price Page</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product Page</NavLink>
        </li>
        <li>
          <Link to="/login" className={styles.ctaLink}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default PageNav
