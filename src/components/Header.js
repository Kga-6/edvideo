import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";

// Style Sheets
import "../Header.css";

// Components
import Search from "./Search";

// Images
import search from '../images/search.svg'

const ThemeMode = () => {
  const [theme, setTheme] = useState("light");

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    setTheme("dark")
  }
  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    setTheme("light")
  }
  const themetoggle = () => {
    if(document.querySelector("body").getAttribute("data-theme") === "dark"){
      setLightMode();
    }else{
      setDarkMode();
    }
  }

  return(
    <button onClick={()=>{themetoggle()}} className="themeBtn">
      {theme == "light"? "Dark" : "Light"}
    </button>
  )
}

export default function Header() {
  const refSearch = useRef(null)

  const handleSearch = ()=>{
    if(refSearch.current){
      refSearch.current.style.display = refSearch.current.style.display === 'none' ? 'flex' : 'none';
    }
    console.log(refSearch.current)
  }

  return(
    <div className="header">
      <div className="header-content">

        <div className="left-content">
          <Link className="header-logo-container" to="/home"> 
            <span className="header-logo logo-ed">Ed</span>
            <span className="header-logo logo-video">video</span>
          </Link>
        </div>

        <div ref={refSearch} className="center-content">
          <button onClick={()=>{handleSearch()}} className="header-search-back">
            {"<"}
          </button>
          <Search/>
        </div>
        
        <div className="right-content">
          <button onClick={()=>{handleSearch()}} className="header-search-mobile-btn">
              <img className="header-search-mobile-img" src={search}></img>
          </button>
          <ThemeMode/>
        </div>

      </div>
    </div>
  )
}