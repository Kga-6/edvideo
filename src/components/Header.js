import React, {useState} from "react";

// Style Sheets
import "../Header.css";

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
  return(
    <div className="header">
      <div className="header-content">
        <div className="header-logo-container">
          <span className="header-logo logo-ed">Ed</span>
          <span className="header-logo logo-video">video</span>
        </div>
        <div className="header-link">
          <ThemeMode/>
        </div>
      </div>
    </div>
  )
}