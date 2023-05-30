import { useEffect, useRef, useState } from "react"
import ResizeObserver from 'resize-observer-polyfill';

import './Tabs.css'

export default function Tabs({tagList,filter,filterTag}){

  const ref = useRef()
  const [showNav,setShowNav] = useState(true)
  const [showNavLeft,setShowNavLeft] = useState(false)
  const [showNavRight,setShowNavRight] = useState(false)

  const update = () =>{
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    const isReachedMaxScroll = scrollLeft + clientWidth === scrollWidth;

    if(ref.current.scrollLeft == 0){
      setShowNavLeft(false)
    }else{
      setShowNavLeft(true)
    }

    setShowNavRight(!isReachedMaxScroll)
  }

  const scrollRight = () =>{
    ref.current.scrollLeft += 100; // Adjust scroll distance as needed
    update()
  }

  const scrollLeft = () =>{
    ref.current.scrollLeft -= 100; // Adjust scroll distance as needed
    update()
  }

  useEffect(()=>{

    const resizeObserver = new ResizeObserver((entries) => {

      if (ref.current) {
        const element = ref.current
        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = ref.current;

        const isElementOverflowing = scrollWidth > clientWidth || scrollHeight > clientHeight;
        const isReachedMaxScroll = scrollLeft + clientWidth === scrollWidth;
        console.log(isReachedMaxScroll)

        setShowNav(isElementOverflowing);

        if(scrollLeft == 0){
          setShowNavLeft(false)
        }else{
          setShowNavLeft(true)
        }

        setShowNavRight(!isReachedMaxScroll)

      }
    })

    // Start observing the target element
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Cleanup observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };

  },[ref.current])

  
  return(
    <div className="tab-filter">

      <div ref={ref} className="tab-filter-list">

        {
          showNav && showNavLeft &&
          <div className="tab-filter-left">
            <button onClick={()=>{scrollLeft()}} className="tab-filter-nav-btn">{"<"}</button>
          </div>
        }

        {
          tagList.map((tag, index) => {
            return(
              <button onClick={()=>{filterTag(tag)}} data-seleted={filter==tag?"true":"false"} className="tab-btn" key={index}>
                <label className="tab-label">{tag}</label>
              </button>
            )
          })
        }

        {
          showNav && showNavRight &&
          <div className="tab-filter-right">
            <button onClick={()=>{scrollRight()}} className="tab-filter-nav-btn">{">"}</button>
          </div>
        }

      </div>
      
    </div>
  )
}