import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import love from "../../assets/love.png";
import { CoinContext } from "../../context/CoinContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { auth } from "../../firebase";

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
      setNotFound(false);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please log in to search for coins.");
      return; 
    }

    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
    setNotFound(coins.length === 0);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  const handleCoinClick = (coinId) => {
    if (user) {
      navigate(`/coin/${coinId}`);
    } else {
      alert("Please log in to view coin details.");
    }
  };

  const handleAddToFavourite = (coin) => {
    const userId = user?.uid; 
    if (!userId) {
      alert("Please log in to add coins to your favourites.");
      return;
    }

    const storedFavourites =
      JSON.parse(localStorage.getItem(`favourites_${userId}`)) || [];

    const isAlreadyFavourite = storedFavourites.some(
      (item) => item.id === coin.id
    );
    if (isAlreadyFavourite) {
      alert("This coin is already in your favourites.");
      return;
    }

    const updatedFavourites = [...storedFavourites, coin];
    localStorage.setItem(
      `favourites_${userId}`,
      JSON.stringify(updatedFavourites)
    );
  };

  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <h1>
          Largest <br /> Crypto Marketplace
        </h1>
        <p>
          Welcome to the world's largest cryptocurrency marketplace.
          <b>CoinScope</b> is a modern crypto tracking platform that displays
          real-time market data with a clean, user-friendly interface.”
        </p>
        <form onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            list="coinlist"
            value={input}
            type="text"
            placeholder="Search crypto.."
            required
          />

          <datalist id="coinlist">
            {allCoin.map((item, index) => (
              <option key={index} value={item.name} />
            ))}
          </datalist>

          <button type="submit">Search</button>
        </form>
      </div>
      {notFound ? (
        <div className="not-found">Coin not found</div>
      ) : (
        <div className="crypto-table">
          <div className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{ textAlign: "center" }}>24H Change</p>
            <p className="action">Action</p>
          </div>
          {displayCoin.slice(0, 10).map((item, index) => (
            <div
              className="table-layout"
              key={index}
              onClick={() => handleCoinClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt="" />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>
                {currency.symbol} {item.current_price.toLocaleString()}
              </p>
              <p
                className={
                  item.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {Math.floor(item.price_change_percentage_24h * 100) / 100}
              </p>
              <button
                className="action"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleAddToFavourite(item); 
                }}
              >
                <img className="love" src={love} alt="" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
