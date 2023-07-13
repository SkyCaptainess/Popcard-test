import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { Header, Footer } from "./pages/layout";
import Home from "./pages/home";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";

function App() {

  return (
    // <PayPalScriptProvider options={{ 'client-id': 'YOUR_PAYPAL_CLIENT_ID' }}>
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
    // </PayPalScriptProvider>
  );
}

export default App;
