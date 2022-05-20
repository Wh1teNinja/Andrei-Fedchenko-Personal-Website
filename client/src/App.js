import "./App.css";

import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Home from "./Home";
import Portfolio from "./Portfolio";
import Login from "./Login";
import Admin from "./Admin";

import { ReactComponent as MenuButton } from "./images/icons/menu-button.svg";
import { ReactComponent as Sun } from "./images/icons/sun.svg";
import { ReactComponent as Moon } from "./images/icons/moon.svg";

const client = new ApolloClient({
  uri: "http://localhost:" + (process.env.PORT || 4200) + "/graphql",
  cache: new InMemoryCache(),
  fetchOption: {
    mode: "cors",
  },
});

function App() {
  let [darkThemeOn, setDarkThemeOn] = useState(false);
  let [showMenu, setShowMenu] = useState(false);

  let [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken") || null);

  useEffect(() => {
    console.log(jwtToken);
    localStorage.setItem("jwtToken", jwtToken);
  }, [jwtToken]);

  return (
    <ApolloProvider client={client}>
      <div className={"App " + (darkThemeOn ? "dark-theme" : "")}>
        <header className='App-header row space-around'>
          <div className='dark-theme-toggler-wrapper'>
            <Sun />
            <div
              className='dark-theme-toggler'
              onClick={() => setDarkThemeOn(!darkThemeOn)}
            >
              <div className='dark-theme-toggler-pin'></div>
            </div>
            <Moon />
          </div>
          <nav className='main-menu row hide-mobile'>
            <Link to='/'>
              <h4 className='main-menu-element'>Home</h4>
            </Link>
            <Link to='/portfolio'>
              <h4 className='main-menu-element'>Portfolio</h4>
            </Link>
          </nav>
          <MenuButton
            onClick={() => setShowMenu(!showMenu)}
            className='main-menu-toggler hide-desktop'
          />
          <nav
            className={
              "main-menu-mobile hide-desktop " + (showMenu ? "" : "slide-out")
            }
          >
            <Link to='/' onClick={() => setShowMenu(!showMenu)}>
              <h4 className='main-menu-element'>Home</h4>
            </Link>
            <Link to='/portfolio' onClick={() => setShowMenu(!showMenu)}>
              <h4 className='main-menu-element'>Portfolio</h4>
            </Link>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
          <Route path='/admin' element={jwtToken ? <Admin /> : <Login setJwtToken={setJwtToken}/>} />
        </Routes>
        <hr/>
        <footer className='App-footer'>
          <h3>Andrei Fedchenko</h3>
          <p>Copyright © 2022 Andrei Fedchenko. All right reserved.</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
