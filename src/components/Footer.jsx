import styles from "./Footer.module.css"

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} by TravelMap Inc.
      </p>
    </footer>
  )
}

export default Footer
