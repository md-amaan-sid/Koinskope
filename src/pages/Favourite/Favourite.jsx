import React, { useState, useEffect } from "react";
import "./Favourite.css";
import trash_bin from "../../assets/trash_bin.png";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Favourite = () => {
  const [favourites, setFavourites] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedFavourites =
          JSON.parse(localStorage.getItem(`favourites_${currentUser.uid}`)) ||
          [];
        setFavourites(storedFavourites);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFavourite = (coinId) => {
    const updatedFavourites = favourites.filter((coin) => coin.id !== coinId);
    setFavourites(updatedFavourites);
    localStorage.setItem(
      `favourites_${user.uid}`,
      JSON.stringify(updatedFavourites)
    );
  };

  const handleCoinClick = (coinId) => {
    if (user) {
      navigate(`/coin/${coinId}`);
    } else {
      alert("Please log in to view coin details.");
    }
  };

  return (
    <div className="favourite">
      <Navbar />
      <div className="favourite-container">
        <h1>Your Favourite Coins</h1>
        {favourites.length === 0 ? (
          <p className="para">No favourite coins added yet.</p>
        ) : (
          <div className="crypto-table">
            <div className="table-layout">
              <p>#</p>
              <p>Coins</p>
              <p>Price</p>
              <p style={{ textAlign: "center" }}>24H Change</p>
              <p className="action">Action</p>
            </div>
            {favourites.map((coin, index) => (
              <div
                className="table-layout"
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleCoinClick(coin.id)}
              >
                <p>{coin.market_cap_rank}</p>
                <div>
                  <img src={coin.image} alt="" />
                  <p>{coin.name + " - " + coin.symbol}</p>
                </div>
                <p>
                  {coin.currencySymbol} {coin.current_price.toLocaleString()}
                </p>
                <p
                  className={
                    coin.price_change_percentage_24h > 0 ? "green" : "red"
                  }
                >
                  {Math.floor(coin.price_change_percentage_24h * 100) / 100}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removeFavourite(coin.id);
                  }}
                >
                  <img className="bin" src={trash_bin} alt="" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favourite;
