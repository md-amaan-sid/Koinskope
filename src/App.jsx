import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Coin/Coin";
import Login from "./pages/Login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import ProtectedRoute from "./components/ProtectedRoute";
import Favourite from "./pages/Favourite/Favourite";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in");
      
        if (window.location.pathname === "/login") {
          navigate("/");
        }
      } else {
        console.log("User logged out");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coin/:coinId"
          element={
            <ProtectedRoute>
              <Coin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
