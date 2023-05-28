import { Link } from "react-router-dom";

export default function GoToHome(){
  return(
    <div className="go-to-home">
      <Link className="go-to-home-btn" to={'/home'}>
        GO TO HOME
      </Link>
    </div>
  )
}