import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useUrlPosition } from "../hooks/useUrlPosition"
import { useCities } from "../contexts/CityContext"
import Button from "./Button"
import BackButton from "./BackButton"
import Spinner from "./Spinner"
import Message from "./Message"
import styles from "./Form.module.css"

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [cityName, setCityName] = useState("")
  const [country, setCountry] = useState("")
  const [emoji, setEmoji] = useState("")
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState("")
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState("")
  const navigate = useNavigate()

  const [lat, lng] = useUrlPosition()
  const { createCity, isLoading } = useCities()
  const { userId } = useParams()

  useEffect(() => {
    if (!lat && !lng) return

    const fetchCityName = async () => {
      try {
        setIsLoadingGeocoding(true)
        setGeocodingError("")
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()
        if (!data.countryCode)
          throw new Error(
            "That's doesn't seem to be a city. Click somewhere else 😉"
          )

        setCityName(data.city || data.locality || "")
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
      } catch (err) {
        console.log(err)
        setGeocodingError(err.message)
      } finally {
        setIsLoadingGeocoding(false)
      }
    }

    fetchCityName()
  }, [lat, lng])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cityName || !date) return

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    }

    await createCity(userId, newCity)
    navigate(`/app/${userId}`)
  }

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />

  if (isLoadingGeocoding) return <Spinner />

  if (geocodingError) return <Message message={geocodingError} />

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  )
}

export default Form
