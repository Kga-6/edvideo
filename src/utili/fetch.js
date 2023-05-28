import axios from "axios";

export const fetch_videos_tags = async function(){
  console.log("[Fetching] Videos Tags...")

  try{
    const response = await axios.get('/videosTags.json')
    console.log(response.data)
    return response
  } catch (error){
    console.log(error)
  }
}

export const fetch_videos = async function(){
  console.log("[Fetching] Videos...")

  try{
    const response = await axios.get('/videos.json')
    console.log(response.data)
    return response
  } catch (error){
    console.log(error)
  }
}