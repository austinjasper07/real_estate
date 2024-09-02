import {Routes, Route} from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import About from "./pages/About"
import NotFoundPage from "./pages/NotFoundPage"
import Modal from "./components/Modal"
import {Toaster} from "react-hot-toast"

export default function App() {
  return (
    <main className="App">
      <Header />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/modal" element={<Modal />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
      <Footer/>
    </main>
  )
}

// import React, { useState } from "react";
// import Modal from "./components/Modal";

// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-[rgb(255,255,219)] min-h-screen p-6">
//       <button
//         onClick={handleOpenModal}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         Open Modal
//       </button>

//       <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
//         <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
//         <p className="mb-4">This is the modal content.</p>
//         <button
//           onClick={handleCloseModal}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Close Modal
//         </button>
//       </Modal>
//     </div>
//   );
// }

// export default App;
