import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

// Style Sheets
import "./Search.css"

// Images
import search from '../images/search.svg'

// Utili
import {fetch_videos} from '../utili/fetch'

const SearchResult = (props) =>{
  const {result} = props

  return(
    <Link className="result" to={`/watch/${result.videoId}`}>
      <div className="search-result-img-container">
        <img className="search-result-img" src={result.thumbnail}></img>
      </div>
      <div className="search-result-info">
        <span className="search-result-title">{result.title}</span>
      </div>
    </Link>
  )
}

export default function Search(){

  const [searchInput,setSearchInput] = useState("")
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [results,setResults] = useState(null)

  const [videos,setVideos] = useState([])

  const handleSearch = (e)=>{
    const {value} = e.target
    e.preventDefault();
    setSearchInput(value)

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      // Perform the search here
      handleSearching(value);
    }, 500);

    setTypingTimeout(timeout);
  }

  const handleSearching = (query)=>{
    const searchWord = query.toLowerCase()
    const search_words = searchWord.split(' ');

    const newResults = []

    const addResult = (video) =>{
      let resulted = false
      newResults.forEach((result)=>{
        if(video.videoId === result.videoId){
          resulted = true
        }
      })

      if(resulted == false){
        newResults.push(video)
      }
    }

    videos.forEach((video)=>{

      const title = video.title.toLowerCase()
      const words_array = title.split(' ');

      words_array.forEach((a)=>{ // loop through the title words

        for(let i=0;i<a.length;i++){ // loop though the title words to get letters
          const firstLetter = a[0] // get the first letter
    
          search_words.forEach((k)=>{ // loop through the search words
            let matched = false
    
            for(let m=0;m<k.length;m++){ // loop through the word to get letters
              if(k[0]===firstLetter){ // check if the first letters match
                if(k[m]==a[m]){
                  matched = true
                }else{
                  return
                }
              }
            }
            if(matched){
              addResult(video)
            }
          })
        }
      })

      // check if keyword == a video tag
      video.tags.forEach((tag)=>{
        const tag_word = tag.toLowerCase()

        if(search_words.includes(tag_word)){
          addResult(video)
        }
      })

    })

    setResults(newResults)

  }

  useEffect(()=>{
    const videosList = fetch_videos()

    videosList.then((response)=>{
      console.log(response.data)
      setVideos(response.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])
  

  return(
    <div className="search">
      <input className="search-input" placeholder="Search" type="search" value={searchInput} onChange={handleSearch}></input>
      
      {
        results && searchInput.length>0 &&

        <div className="search-results">
          {
            results.map((result,index)=>{
              return(
                <SearchResult  key={index} result={result}/>
              )
            })
          }
        </div>
        
      }
      
    </div>
  )
}