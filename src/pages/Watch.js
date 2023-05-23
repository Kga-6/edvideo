import { useParams,Link } from "react-router-dom"

// Style Sheets
import "../Watch.css"

// Components
import Video from '../components/Video'; 

export default function Assignments() {
  const {id} = useParams()
  return(
    <>
      <Link to={`/home`}>
        <div className="back-header">
          <div className="back-header-container">
            <span className="">{"< Video Assignment"}</span>
          </div>
        </div>
      </Link>
      <div className="watch">
        <Video id={id}/>
      </div>
    </>
  )
}