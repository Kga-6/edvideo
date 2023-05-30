import axios from "axios";

const tags_storage = 'https://raw.githubusercontent.com/Kga-6/edvideo/master/public/videosTags.json'
const videos_storage = 'https://raw.githubusercontent.com/Kga-6/edvideo/master/public/videos.json'

export const fetch_videos_tags = async function(){
  console.log("[Fetching] Videos Tags...")

  try{
    const response = await axios.get(tags_storage)
    return response
  } catch (error){
    console.log(error)
  }
}

export const fetch_videos = async function(){
  console.log("[Fetching] Videos...")

  try{
    const response = await axios.get(videos_storage)
    return response
  } catch (error){
    console.log(error)
  }
}