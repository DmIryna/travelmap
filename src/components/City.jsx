import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useCities } from "../contexts/CityContext"
import Spinner from "./Spinner"
import BackButton from "./BackButton"
import styles from "./City.module.css"

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date))

function City() {
  const { userId, id } = useParams()
  const [searchParams] = useSearchParams()
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  const { currentCity, getCurrentCity, isLoading } = useCities()
  const { cityName, emoji, date, notes } = currentCity

  useEffect(() => {
    getCurrentCity(userId, id)
  }, [id, getCurrentCity, userId])

  if (isLoading) return <Spinner />

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>
          City name {lat}, {lng}
        </h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  )
}

export default City
