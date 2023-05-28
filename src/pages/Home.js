import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

// Style Sheets
import "../Home.css";

// Utili
import {fetch_videos_tags,fetch_videos} from '../utili/fetch'

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

  const [videos,setVideos] = useState([])
  const [tags,setTags] = useState([])
  const [loadingVideos,setLoadingVideos] = useState(true)
  const [loadingTags,setLoadingTags] = useState(true)

  const [filter, setFilter] = useState("All")
  const [filterVideos, setFilterVideos] = useState([])
  const [fetchCount, setFetchCount] = useState(15)
  const [loading, setLoading] = useState(false)

  const filterTag = (tag) => {
    console.log("filtering tag: ", tag)
    setFilter(tag)
  }

  const getVideos = () => {
    const newVideos = []

    videos.map(video => {
      // if filter is all, then return all videoss
      if(filter == "All"){
        newVideos.push(video)
      }else{
        // if filter is not all, then return only videos with the filter tag
        if(video.tags.includes(filter)){
          newVideos.push(video)
        }
      }
    })

    setFilterVideos(newVideos.slice(0, fetchCount))
    setLoading(false)
  }


  useEffect(() => {
    setFetchCount(15)
    getVideos()
  },[filter,videos])

  useEffect(() => {
    getVideos()
  },[fetchCount,videos])

  useEffect(()=>{
    const videosList = fetch_videos()
    const videoTags = fetch_videos_tags()

    videoTags.then((response) => {
      console.log(response.data)
      setLoadingTags(false)
      setTags(response.data)
    }).catch((error)=>{
      console.log(error)
    })

    videosList.then((response)=>{
      console.log(response.data)
      setLoadingVideos(false)
      setVideos(response.data)
    }).catch((error)=>{
      console.log(error)
    })
    
  },[])

  return(
    <>
      <div className="home">

        {
          loadingTags ? <div>Loading Tags...</div> :
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
        }
        
        {
          loadingVideos? <div>Loading Videos...</div> :
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
        }

        { filterVideos.length > 0 && 
        <div className="video-load">
          <button className="load-more" onClick={
            ()=>{

              let newCount = fetchCount + 15
              if(newCount >= videos.length){
                newCount = videos.length
                console.log("No more videos to load")
              }else{
                setLoading(true)
                setFetchCount(newCount)
              }
              setLoading(true)
            }
          }>{loading?<PulseLoader size={10} color="#646464" />:"Load More"}</button>
        </div>}

        
      </div>
    </>
  )
}
