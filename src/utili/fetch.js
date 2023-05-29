import axios from "axios";

export const fetch_videos_tags = async function(){
  console.log("[Fetching] Videos Tags...")

  try{
    const response = await axios.get('https://raw.githubusercontent.com/Kga-6/edvideo/master/public/videosTags.json')
    return response
  } catch (error){
    console.log(error)
  }
}

export const fetch_videos = async function(){
  console.log("[Fetching] Videos...")

  try{
    const response = await axios.get('https://raw.githubusercontent.com/Kga-6/edvideo/master/public/videos.json')
    return response
  } catch (error){
    console.log(error)
  }
}