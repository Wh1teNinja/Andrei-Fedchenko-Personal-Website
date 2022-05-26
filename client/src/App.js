import "./styles/App.css";

import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import { ReactComponent as MenuButton } from "./images/icons/menu-button.svg";
import { ReactComponent as Sun } from "./images/icons/sun.svg";
import { ReactComponent as Moon } from "./images/icons/moon.svg";

const apiUrl = "http://localhost:4200";

const client = new ApolloClient({
  uri: apiUrl + "/graphql",
  cache: new InMemoryCache(),
  fetchOption: {
    mode: "cors",
  },
});

function App() {
  let [darkThemeOn, setDarkThemeOn] = useState(
    localStorage.getItem("darkTheme") === "true"
  );

  // menu state for mobile devices(open or closed) 
  let [showMenu, setShowMenu] = useState(false);

  let [jwtToken, setJwtToken] = useState(
    localStorage.getItem("jwtToken") === "null"
      ? null
      : localStorage.getItem("jwtToken")
  );

  // saves jwt token
  useEffect(() => {
    localStorage.setItem("jwtToken", jwtToken);
  }, [jwtToken]);

  // saves dark theme status 
  useEffect(() => {
    localStorage.setItem("darkTheme", darkThemeOn);
  }, [darkThemeOn]);

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
          <Route path='/' element={<Home apiUrl={apiUrl} />} />
          <Route path='/portfolio' element={<Portfolio apiUrl={apiUrl} />} />
          <Route
            path='/admin'
            element={
              jwtToken ? (
                <Admin apiUrl={apiUrl} />
              ) : (
                <Login apiUrl={apiUrl} setJwtToken={setJwtToken} />
              )
            }
          />
        </Routes>
        <hr />
        <footer className='App-footer'>
          <h3>Andrei Fedchenko</h3>
          <p>Copyright © 2022 Andrei Fedchenko. All right reserved.</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
