import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

// Style Sheets
import "../Home.css";

// JSONS Data
import videos from '../date_folder/videos.json'
import tags from '../date_folder/videosTags.json'

function EmptyList(props){
  const {filter} = props

  return(
    <div className="empty-list">
      <h1>Couldn't find any {filter} videos</h1>
      <p>Change the filter option to find other videos!</p>
    </div>
  )
}

function Play(props){

  const {data} = props

  return(
    <Link to={`/watch/${data.videoId}`}>
      <div className="Play">
        <div className="play-image-container">
          <img className="play-image" loading="lazy" src={data.thumbnail}></img>
          <span className="play-time">{data.durationLabel}</span>
        </div>
        <div className="play-info">
          <div className="play-info-title">{data.title}</div>
          <div className="play-info-qLength">{data.questions.length} Questions</div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {

  const [filter, setFilter] = useState("All")
  const [filterVideos, setFilterVideos] = useState([])

  const filterTag = (tag) => {
    console.log("filtering tag: ", tag)
    setFilter(tag)
  }

  const getVideos = () => {
    const newVideo = []

    videos.map(video => {
      // if filter is all, then return all videoss
      if(filter == "All"){
        newVideo.push(video)
      }else{
        // if filter is not all, then return only videos with the filter tag
        if(video.tags.includes(filter)){
          newVideo.push(video)
        }
      }
    })

    setFilterVideos(newVideo)
  }

  useEffect(() => {
    console.log("Updating videos list")
    getVideos()
  },[filter])

  return(
    <>
      <div className="home">
        <div className="video-tags-filter">
          {
            // lets use index as key because we know that the data is not going to change
            tags.map((tag, index) => {
              return(
                <button onClick={()=>{filterTag(tag)}} data-seleted={filter==tag?"true":"false"} className="video-tag-btn" key={index}>
                  <label className="video-tag-label">{tag}</label>
                </button>
              )
            })
          }
        </div>
        
        <div className="video-list">
          {
            filterVideos.length > 0 ? // if

              <div className="video-list-container">
                {
                  filterVideos.map(video => {
                    return <Play key={video.videoId} data={video}/>
                  })
                }
              </div>

            : // else

              <EmptyList filter={filter}/>
          }
        </div>
      </div>
    </>
  )
}
