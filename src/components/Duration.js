import React from 'react'

export default function Duration ({ className, seconds, seekLocked }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds,seekLocked)}
    </time>
  )
}

function format (seconds,seekLocked) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  let label = 'Loading...'

  if(seekLocked == true){
    label = <p style={{color:"red",margin:0}}>Locked</p>
  }else{
    if (hh) {
      label = `${hh}:${pad(mm)}:${ss}`
    }
    label = `${mm}:${ss}`
  }

  return label
}

function pad (string) {
  return ('0' + string).slice(-2)
}