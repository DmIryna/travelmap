import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"

import { CityProvider } from "./contexts/CityContext"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./pages/ProtectedRoute"

import CityList from "./components/CityList"
import CountryList from "./components/CountryList"
import City from "./components/City"
import Form from "./components/Form"
import SpinnerFullPage from "./components/SpinnerFullPage"
import Register from "./pages/Register"

const HomePage = lazy(() => import("./pages/HomePage"))
const Product = lazy(() => import("./pages/Product"))
const Pricing = lazy(() => import("./pages/Pricing"))
const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const AppLayout = lazy(() => import("./pages/AppLayout"))
const Login = lazy(() => import("./pages/Login"))

function App() {
  return (
    <div>
      <AuthProvider>
        <CityProvider>
          <BrowserRouter>
            <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route
                  path="/app/:userId"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path="cities" element={<CityList />} />
                  <Route path="cities/:id" element={<City />} />
                  <Route path="countries" element={<CountryList />} />
                  <Route path="form" element={<Form />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CityProvider>
      </AuthProvider>
    </div>
  )
}

export default App
