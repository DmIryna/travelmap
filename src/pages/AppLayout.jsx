import Map from "../components/Map"
import Sidebar from "../components/Sidebar"
import User from "../components/User"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCities } from "../contexts/CityContext"
import styles from "./AppLayout.module.css"

function AppLayout() {
  const { userId } = useParams()
  const { getAllCities } = useCities()

  useEffect(() => {
    getAllCities(userId)
  }, [userId, getAllCities])

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  )
}

export default AppLayout
