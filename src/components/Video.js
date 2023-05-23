import React, { Component } from 'react';
import ReactPlayer from 'react-player';

// Style Sheets
import "../Video.css";

// Components
import Duration from '../components/Duration';

// JSONS Data
import videos from '../date_folder/videos.json'

// Images
import pauseIcon from '../images/pause.svg'
import playIcon from '../images/play.svg'
import fullscreenIcon from '../images/fullscreen.svg'
import volumeIcon from '../images/volume.svg'
import volumeMuteIcon from '../images/volume-mute.svg'
import rewatchIcon from '../images/rewatch.svg'

class Video extends Component{

  componentDidMount() {

    videos.map((video) => {
      if(video.videoId == this.props.id){
        this.load(video.url) // Load the video on mount with the url passed in
      }
    })

    this.fetchVideoData() // Fetch the video data from the JSON file

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange); // For Safari
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange); // For Firefox
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange); // For IE

    this.resizeObserver = new ResizeObserver((entries) => {

      if(this.state.quizSpots == null) return
      if(this.VideoSeek == null) return

      // Get the new width and height from the first entry
      const { width, height } = entries[0].contentRect;
      const newSize = { width, height };

      // Check if the size has changed
      if (newSize.width !== this.state.seekSize.width || newSize.height !== this.state.seekSize.height) {
        this.setState({ seekSize: newSize })

        // Run your function heres
        const newSpots = []
        this.state.quizSpots.forEach((spot)=>{
          newSpots.push({
            ...spot,
            position:spot.duration*this.VideoSeek.offsetWidth
          })
        })
        this.setState({quizSpots:newSpots})
      }
    })

    if (this.VideoSeek) {
      this.resizeObserver.observe(this.VideoSeek);
    }

    console.log(this.state)
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // Code to run after the component updates
  //   // This is equivalent to the useEffect(() => {}) without any dependency array in a functional component
  // }

  componentWillUnmount() {
    // Code to run before the component is unmounted and destroyed
    if (this.resizeObserver && this.VideoSeek) {
      this.resizeObserver.unobserve(this.VideoSeek);
    }

    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange); // For Safari
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange); // For Firefox
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange); // For IE
  }

  constructor(props) {
    super(props);
    this.state = {
      // Video
      url: null,
      pip: false,
      canPlay: true,
      playing: true,
      controls: false,
      light: false,
      volume: 0.8,
      muted: true,
      played: 0,
      totalPlayed:0,
      seeking:false,
      disableSeek:false,
      lockedMessage:false,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      videoReady:false,
      fullscreen:false,

      // Quiz
      quiz:[],
      quizSpots:[],
      quizAnswers:[],
      currentQustion:0,
      takingQuiz:false,
      answerApt:false,
      complete:false,

      // others
      seekSize: { width: 0, height: 0 }
    }
    this.lockedMessageTimeout=null
    this.resizeObserver = null;
  }

  handleFullscreenChange = () => {
    if (
      document.fullscreenElement === this.VideoContainer ||
      document.webkitFullscreenElement === this.VideoContainer ||
      document.mozFullscreenElement === this.VideoContainer ||
      document.msFullscreenElement === this.VideoContainer
    ) {
      // The component is still in fullscreen mode
      this.setState({fullscreen:true})
      this.VideoControls.classList.add('controlfullscreen')
    } else {
      // The component has exited fullscreen mode
      this.setState({fullscreen:false})
      this.VideoControls.classList.remove('controlfullscreen')
      console.log('Component exited fullscreen');
    }
  };

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }

  playerRef = player => {
    this.player = player
  }
  VideoContainerRef = VideoContainer => {
    this.VideoContainer = VideoContainer
  }
  VideoControlsRef = VideoControls => {
    this.VideoControls = VideoControls
  }
  VideoSeekRef = VideoSeek => {
    this.VideoSeek = VideoSeek
  }

  fetchVideoData = () => {
    let newData= []
    let spots = []
    let answers = []

    videos.forEach((video) => {
      if(video.videoId == this.props.id){
        newData = video
      }
    })

    newData.questions.forEach((question) => {
      spots.push(
        {
          id:question.id,
          correct:null,
          position:question.duration*this.VideoSeek.offsetWidth, // MISSING
          duration:question.duration
        }
      )
    })

    newData.questions.forEach((question) => {
      const newQuestionTable = {
        answered:false,
        correct:false,
        grade:0,
        questionId:question.id,
        responses:[]
      }
      question.options.forEach((option)=>{
        newQuestionTable.responses.push({
          id:option.id,
          response:null
        })
      })
      answers.push(newQuestionTable)
    })

    this.setState({
      quiz:newData
    })
    this.setState({
      quizSpots:spots
    })
    this.setState({
      quizAnswers:answers
    })

  }

  handlePlayPause = () => {
    if(this.state.canPlay == false) return;
    this.setState({ playing: !this.state.playing })
  }

  handlePlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }

  handlePause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }

  handleDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }

  handleSeekChange = e => {
    if(this.state.totalPlayed < e.target.value && this.state.quiz.locked == true){
      this.setState({ played: parseFloat(this.state.totalPlayed) })
      this.setState({
        lockedMessage:true
      })
      this.handleLockedMessageTimeout()
      return
    }else{
      this.setState({ played: parseFloat(e.target.value) })
    }
  }

  handleSeekMouseDown = e => {
    this.setState({ seeking: true })
  }

  handleSeekMouseUp = e => {
    this.setState({ seeking: false })

    if(this.state.totalPlayed < e.target.value && this.state.quiz.locked == true){
      this.player.seekTo(parseFloat(this.state.totalPlayed))
      this.setState({
        lockedMessage:true
      })
      this.handleLockedMessageTimeout()
      return
    }else{
      this.player.seekTo(parseFloat(e.target.value))
    }
  }

  handleFullScreen = () =>{

    if(this.VideoContainer == null) return;

    if(this.VideoContainer){
      if(document.fullscreenElement){
        this.setState({fullscreen:false})
        document.exitFullscreen()
      }else{
        if (this.VideoContainer.webkitRequestFullscreen) {
          this.VideoContainer.webkitRequestFullscreen();
        }else{
          this.VideoContainer.requestFullscreen()
        }
        this.setState({fullscreen:true})
      }
    }else{
      this.setState({fullscreen:false})
    }

  }

  handleQuizReady = (spot) => {
    this.setState({
      playing:false,
      canPlay:false,
      disableSeek:true,
      takingQuiz:true,
      played:parseFloat(spot.duration),
      currentQustion:spot.id
    })
    this.player.seekTo(parseFloat(spot.duration))
  }

  handleProgress = state => {
    // We only want to update time slider if we are not currently seeking
    
    if(this.state.takingQuiz == true || this.state.canPlay == false){
      this.player.seekTo(parseFloat(this.state.played))
      return
    }
    
    if (!this.state.seeking) {
      this.setState(state)

      // Update total played time 
      if(state.played >= this.state.totalPlayed){
        this.setState({totalPlayed:state.played})
      }

      // Check if the video is at the end
      if(state.played >= 0.9900){
        this.handleCompleted()
        return
      }

      // Check if the state played is at a quiz spot
      this.state.quizSpots.forEach((spot) => {
        if(state.played.toFixed(2) == spot.duration && this.state.takingQuiz == false){
          this.state.quizAnswers.forEach((answer) => {
            if(answer.questionId == spot.id){
              if(answer.answered == false){
                console.log("Video is at a quiz spot")
                this.handleQuizReady(spot)
              }
            }
          })
        }
      })
    }
  }

  handleContinue = () => {
    this.setState({
      canPlay:true,
      playing:true,
      disableSeek:false,
      takingQuiz:false,
      answerApt:false
    })
  }

  handleSpotClick = (id) => {
    this.state.quiz.questions.forEach((question) => { 
      if(question.id == id){

        if(this.state.totalPlayed <= question.duration && this.state.quiz.locked == true){
          this.player.seekTo(parseFloat(this.state.totalPlayed))
          this.setState({
            lockedMessage:true
          })
          this.handleLockedMessageTimeout()
          return
        }

        if(this.state.canPlay == true){
          this.setState({
            canPlay:false,
            playing:false,
            disableSeek:true,
            takingQuiz:true,
            played:parseFloat(question.duration),
            currentQustion:question.id
          })
          this.player.seekTo(parseFloat(question.duration))
        }
      }
    })
  }

  handleRewatch = () => {
    console.log("Rewatch")
    this.handleContinue()

    let newDuration = 0
    let lastDuration = 0

    for(let i=0;i<this.state.quiz.questions.length;i++){
      let question = this.state.quiz.questions[i]
      let nextquestion = this.state.quiz.questions[i+1]

      if(question && nextquestion){
        if(this.state.played >= question.duration && this.state.played < nextquestion.duration){
          newDuration = question.duration
          if(this.state.played == question.duration){
            newDuration = lastDuration
          }
          break;
        }
      } else if(question && !nextquestion){
        if(this.state.played >= question.duration){
          newDuration = question.duration
          if(this.state.played == question.duration){
            newDuration = lastDuration
          }
          break;
        }
      }

      lastDuration = question.duration
    }

    this.player.seekTo(parseFloat(newDuration))
    this.setState({
      played:parseFloat(newDuration)
    })
  }

  handleCompleted = () => {
    console.log("Completed")
    let everythingAnswered = true

    this.state.quiz.questions.forEach((question)=>{
      this.state.quizAnswers.forEach((answer)=>{
        if(answer.questionId == question.id){
          if(answer.answered == false){
            everythingAnswered = false
          }
        }
      })
    })

    if(everythingAnswered == true){
      this.setState({
        complete:true,
        playing:false
      })
    }else{
      this.setState({
        complete:false 
      })
    }
  }

  handleLockedMessageTimeout = () => {
    if(this.state.lockedMessage == false){
      this.lockedMessageTimeout = setTimeout(() => {
        this.setState({ lockedMessage: false });
      }, 2000);
    }
  }

  render(){
    const { 
      // Video
      url, 
      playing, 
      controls, 
      light, 
      volume, 
      muted, 
      loop, 
      played, 
      loaded, 
      duration, 
      playbackRate, 
      pip,

      // Quiz
      quiz,
      quizSpots,
      quizAnswers,
      currentQustion,
      takingQuiz,
      answerApt,
      complete,
      lockedMessage
    } = this.state

    return(
      <div className='video-player'>
        <div className='video-container' ref={this.VideoContainerRef}>
          <div className='player-container'>
            <ReactPlayer
            
              className='react-player' 
              width='100%'
              height='100%'
              ref={this.playerRef}
              url={url}
  
              controls={controls}
              playing={playing}
              light={light}
              volume={volume}
              loop={loop}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
              config={
                {
                  youtube: {
                    disablekb: 1,
                    modestbranding: 1,
                    controls: 0,
                    showinfo: 0,
                    rel: 0
                  }
                }
              }
            />
          </div>

          <div className='controls' ref={this.VideoControlsRef} >
              <div className='controls-left'>
                <button onClick={this.handlePlayPause} className='control-play-container control-btn-container'>
                  <img className='controls-play controls-action-btn' src={playing?pauseIcon:playIcon}></img>
                </button>
                <button onClick={this.handleRewatch} className='control-rewatch-container control-btn-container'>
                  <img className='controls-rewatch controls-action-btn' src={rewatchIcon}></img>
                </button>
              </div>

              <div className='video-seek'>
                <label className='video-time'>
                  <Duration className={"current-time"} seconds={duration * played} />
                  <Duration className={"max-time"} seconds={duration} seekLocked={lockedMessage} />
                </label>
                <input 
                    className='video-seek-input'
                    ref={this.VideoSeekRef}
                    type='range' min={0}max={0.999999}step='any'
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                    disabled={this.state.disableSeek}
                />
                <div className='spots'>
                  {
                    quizSpots.map((spot)=>{
                      if(spot.correct === true){
                        return <button onClick={()=>{this.handleSpotClick(spot.id)}} key={spot.id.toString()} style={{transform: `translate(${spot.position}px)`}} className='spot spotGreen'></button>;
                      }else if(spot.correct === false){
                        return <button onClick={()=>{this.handleSpotClick(spot.id)}} key={spot.id.toString()} style={{transform: `translate(${spot.position}px)`}} className='spot spotRed'></button>;
                      }else{
                        return <button onClick={()=>{this.handleSpotClick(spot.id)}} key={spot.id.toString()} style={{transform: `translate(${spot.position}px)`}} className='spot'></button>;
                      }
                    })
                  }
                </div>
              </div>

              <div className='controls-right'>
                <button onClick={this.handleToggleMuted} className='control-volume-container control-btn-container'>
                  <img className='controls-volume controls-action-btn' src={muted?volumeMuteIcon:volumeIcon}></img>
                </button>
                <button onClick={this.handleFullScreen} className='control-full-container control-btn-container'>
                  <img className='controls-full controls-action-btn' src={fullscreenIcon}></img>
                </button>
              </div>
          </div>

          {
            (takingQuiz||complete) && 

            <aside className='video-aside'>
              {
                takingQuiz &&
                <div className='questions-container'>
                  <div className='question'>
                    
                    <div style={{backgroundColor:quizAnswers[currentQustion].correct?"#d6ffda":"var(--body_background)"}} className='question-info'>
                      <h1 className='question-h1'>{quiz.questions[currentQustion].type}</h1>
                      <p className='question-p'>{quiz.questions[currentQustion].question}</p> 
                    </div>

                    <div className='question-container'>
                      {
                        answerApt && <p className='select-Label' style={{color:"red",fontWeight:"bolder"}}>You must select one option</p> // if the user has not selected an option then show this message
                      }

                      <div className='option-container'>
                        {
                          quiz.questions[currentQustion].options.map((option,index)=>{
                            const thisAnswered = quizAnswers[currentQustion].answered // check if the user has answered this question
                            const thisChecked = quizAnswers[currentQustion].responses[index].response // check if the user has checked this option

                            return(
                              <div className='option' key={option.option}>
                                <input 
                                  onClick={(e)=>{

                                    // User clicked on an option so update the quizAnswers state with the response 
                                    const newAnswers = [...quizAnswers] // copy the state
                                    newAnswers.forEach((myAnswer)=>{ // loop through the state
                                      if(myAnswer.questionId == currentQustion){ // if the question id matches the current question
                                        myAnswer.responses.forEach((response)=>{ // loop through the responses
                                          if(response.id == option.id){ // if the response id matches the option id
                                            response.response = e.target.checked // set the response to the checked value
                                          } 
                                        }) 
                                      }
                                    })
                                    this.setState({quizAnswers:newAnswers}) // update the state
                                  }}  
                                  className='option-button-multiple' 
                                  key={option.id}  
                                  type='checkbox' 
                                  value={option.text} 
                                  defaultChecked={thisAnswered?thisChecked:null}
                                  disabled={thisAnswered}
                                ></input>

                                <label className='option-label'>{option.text}</label>
                              </div>
                            )
                          })
                        }
                      </div>

                      <div className='question-control'>
                        <button className='question-rewatch question-button' onClick={this.handleRewatch}>Rewatch</button>
                        <button
                          className='question-continue question-button' 
                          onClick={()=>{
                            let thisAnswered = false
                            let thisCorrect = false

                            quizAnswers.forEach((myAnswer,index)=>{ // loop through the answers
                              if(myAnswer.questionId == currentQustion){ // if the question id matches the current question
                                myAnswer.responses.forEach((response,index)=>{ // loop through the responses
                                  if(response.response != null && response.response != false){ // if the response is not null and not false
                                    thisAnswered = true
                                  }
                                })
                              }
                            })

                            if(thisAnswered){ // event if the question has been answered

                              if(quizAnswers[currentQustion].answered == false){ // if the question has not been answered
                                // lets check if the question was answered correctly
                                let myResponse = []
                                quizAnswers.forEach((myAnswer,index)=>{ // loop through the answers
                                  if(myAnswer.questionId == currentQustion){ // if the question id matches the current question
                                    myAnswer.responses.forEach((response,index)=>{ 
                                      
                                      if(response.response == true){
                                        quiz.questions[currentQustion].options.forEach((option)=>{
                                          if(option.id == response.id){
                                            myResponse.push(option.id)
                                          }
                                        })
                                      }

                                    })
                                  }
                                })

                                // check if myResponse is equal to question.answer
                                if(myResponse.length == quiz.questions[currentQustion].answer.length){
                                  myResponse.forEach((response)=>{
                                    if(!quiz.questions[currentQustion].answer.includes(response)){
                                      thisCorrect = false
                                      return // stop because the answer is already wrong
                                    }else{
                                      thisCorrect = true
                                    }
                                  })
                                }

                                // update quizAnswers state with the correct value and answered value
                                const newAnswers = [...quizAnswers] // copy the state
                                newAnswers.forEach((myAnswer)=>{ // loop through the state
                                  if(myAnswer.questionId == currentQustion){ // if the question id matches the current question
                                    myAnswer.answered = true
                                    myAnswer.correct = thisCorrect
                                  }
                                })
                                this.setState({quizAnswers:newAnswers})

                                // update quizSpots state with the correct value
                                const newSpots = [...quizSpots] // copy the state
                                newSpots.forEach((spot,index)=>{ // loop through the state
                                  if(spot.id == currentQustion){ // if the question id matches the current question
                                    spot.correct = thisCorrect
                                  }
                                })
                                console.log("updating spots")
                                this.setState({quizSpots:newSpots})

                              }else { 
                                this.handleContinue() // if the question has been answered then just continue
                              }

                              this.setState({answerApt:false})

                            }else{ // event if the question has not been answered
                              this.setState({answerApt:true})
                            }
                          }}
                        >Continue</button>
                      </div>

                    </div>

                  </div>
                </div>
              }
              {
                complete &&
                <div className='completed-container'>
                  <div className='completed-content'>
                    <div className='completed-header'>
                        <h1 className='completed-h1'>All done</h1>
                        <p className='completed-p'>You have completed this quiz</p>
                    </div>
                    <div className='completed-responses'>
                      <p className='completed-responses-label'>
                      {quizAnswers && quizAnswers.filter((data)=>{return data.correct}).length}/{quizAnswers && quizAnswers.length}</p>
                    </div>
                  </div>
                </div>
              }
            </aside>
          }
        </div>

      </div>
    )
  }
}

export default Video;