import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom"

// Style Sheets
import "../Watch.css"

// Components
import Video from '../components/Video'; 
import VideoNotFound from '../components/VideoNotFound'

// Utili
import {fetch_videos} from '../utili/fetch'

export default function Assignments() {
  
  const {id} = useParams()
  const [video,setVideo] = useState(null)
  const [error,setError] = useState()

  useEffect(()=>{
    const videosList = fetch_videos()

    videosList.then((response)=>{
      response.data.forEach((data)=>{
        console.log(data.videoId,id)
        if(data.videoId == id){
          setVideo(data)
        }
      })
    }).catch((error)=>{
      console.log(error)
    })

  },[])

  return(
    <>

      <div className="back-header">
        <Link to={`/home`}>
          <div className="back-header-container">
            <span className="">{"< Video Assignment"}</span>
          </div>
        </Link>
      </div>

      <div className="watch">
        {video ? <Video id={id} videoData={video}/> : <VideoNotFound/>}
      </div>

    </>
  )
}