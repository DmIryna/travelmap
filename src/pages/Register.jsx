import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import PageNav from "../components/PageNav"
import styles from "./Register.module.css"

function Register() {
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const {
    registerUser,
    error: errorApi,
    isRegistered,
    initialRender,
  } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    initialRender()
  }, [])

  const onSubmit = async (data) => {
    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
    }

    registerUser(newUser)
  }

  useEffect(() => {
    if (isRegistered) setSuccess(true)
  }, [isRegistered])

  return (
    <main className={styles.register}>
      <PageNav />

      {!success ? (
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h3>Register your account</h3>
          <div className={styles.row}>
            <label htmlFor="name">User name</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "User name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters length",
                },
              })}
            />
            <p className={styles.error}>{errors.name?.message}</p>
          </div>

          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
              })}
            />
            <p className={styles.error}>{errors.email?.message}</p>
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters length",
                },
              })}
            />
            <p className={styles.error}>{errors.password?.message}</p>
          </div>

          <div className={styles.btns}>
            <Button type="primary">Register</Button>
            {errorApi && <p className={styles.errorApi}>{errorApi}</p>}
          </div>
        </form>
      ) : (
        <div className={styles.form}>
          <p className={styles.success}>Your account successfully created ✔️</p>
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      )}
    </main>
  )
}

export default Register
