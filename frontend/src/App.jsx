import {Routes, Route} from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import About from "./pages/About"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer/>
    </>
  )
}
