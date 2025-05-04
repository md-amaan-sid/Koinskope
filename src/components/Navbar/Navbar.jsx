import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import love from "../../assets/love.png";
import { CoinContext } from "../../context/CoinContext";
import { Link, useNavigate } from "react-router-dom";
import { logout, auth } from "../../firebase";

const Navbar = () => {
  const { setCurrency, currency } = useContext(CoinContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const currencyHandler = (event) => {
    if (user) {
      switch (event.target.value) {
        case "usd":
          setCurrency({ name: "usd", symbol: "$" });
          break;
        case "eur":
          setCurrency({ name: "eur", symbol: "€" });
          break;
        case "inr":
          setCurrency({ name: "inr", symbol: "₹" });
          break;
        default:
          setCurrency({ name: "usd", symbol: "$" });
          break;
      }
    } else {
      alert("Please log in to change the currency.");
      event.target.value = currency.name;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleFavouritesClick = (e) => {
    if (!user) {
      e.preventDefault(); 
      alert("Please log in to view your favourites.");
    }
  };

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      <div className="nav-right">
       
      <Link to="/favourites" onClick={handleFavouritesClick}>
          <img className="love" src={love} alt=""/>
        </Link>

        <select onChange={currencyHandler} value={currency.name}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>

        {user ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <button onClick={() => navigate("/login")}>Log In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
