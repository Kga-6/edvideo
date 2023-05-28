import { Link } from "react-router-dom";

// Style Sheets
import "../Nopage.css"

// Components
import GoToHome from "../components/GoToHome";

export default function NoPage(){
  return(
    <div className="nopage">
      <div className="nopage-content">
        <h1>404 Not found</h1>
        <p>Well, this is embarrassing. Click on the button below to head back home and we'll try to find our way together!</p>
      </div>

      <GoToHome/>
    </div>
  )
}