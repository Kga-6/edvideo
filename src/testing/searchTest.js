
const words = [
  "Smart Guy",
  "Some Person",
  "User Deleted",
  "person dead",
  "teacher class.",
  "part time",
  "sm sad"
]

const searchInput = "us"
const searchWord = searchInput.toLowerCase() // dont forget to already lower case first
const search_words = searchWord.split(' ');
const newResults = []

function addResult(result){
  let resulted = false
  newResults.forEach((word)=>{
    if(result == word){
      resulted = true
    }
  })

  if(resulted == false){
    newResults.push(result)
  }
}

words.forEach((word)=>{ // loop through the videos to get title
  const title = word.toLowerCase()
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
          addResult(word)
        }
      })
    }
  })
})

console.log("Words to search:",search_words)
console.log("Results:",newResults)
