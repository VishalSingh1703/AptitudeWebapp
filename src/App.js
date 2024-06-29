import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./Components/Home";
import QuestionList from "./Components/Questionlist";
import Footer from "./Components/Footer";
import ForgotPassword from "./pages/forgotpassword";
import Contributors from "./pages/contributors";
import Contact from "./pages/contact";
import Register from "./pages/register";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Navbar from "./Components/Navbar";
import VerifyOTP from "./pages/verifyOTP";
import ResetPassword from "./pages/resetPassword";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contributors" element={<Contributors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions/:path" element={<QuestionList />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
