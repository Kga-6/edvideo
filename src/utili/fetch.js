import axios from "axios";

const usersData = 'users.json'

export const getUser = async function(userId){

  let userData = [] 

  try {
    const response = await axios.get(usersData);

    response.data.forEach((user) => {
      if(user.id == userId){
        userData = user
      }
    });

    return userData;
  } catch (error) {
    console.error(error);
  }

}

export const getAllVideos = function(limit){
  
}

export const getVideo = function(videoId){
  
}