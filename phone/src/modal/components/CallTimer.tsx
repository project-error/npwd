import React, { useState, useCallback, useEffect } from 'react'

function CallTimer({ isAccepted }) {
  const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 })

  useEffect(() => {
    let timer = null
    if (isAccepted) {
      run()
      timer = setInterval(run, 10)
    }
    return () => clearInterval(timer)
  }, []);

  let updatedMs = time.ms, updatedS = time.s, updatedM = time.m, updatedH = time.h;
  
  const run = () => {
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    } 
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    } 
    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0
    }
    updatedMs++;
    return setTime({ ms: updatedMs, s: updatedS, m: updatedM, h: updatedH })
  }

  if (!isAccepted) return null;

  return (
    <div style={{ 
      textAlign: 'center',
      marginTop: '2em',
      fontSize: 30
     }}>
      <span>{(time.h >= 10) ? time.h : '0'+time.h}</span>&nbsp;:&nbsp;
      <span>{(time.m >= 10) ? time.m : '0'+time.m}</span>&nbsp;:&nbsp;
      <span>{(time.s >= 10) ? time.s : '0'+time.s}</span>&nbsp;
    </div>
  )
}

export default CallTimer
