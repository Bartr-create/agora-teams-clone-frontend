import React from 'react'

export default function Controls({ micTrack, camTrack, screenTrack, onShare, onStopShare }) {
  const [micOn, setMicOn] = React.useState(true)
  const [camOn, setCamOn] = React.useState(true)

  const toggleMic = async () => {
    if (!micTrack) return
    await micTrack.setMuted(micOn)
    setMicOn(!micOn)
  }
  const toggleCam = async () => {
    if (!camTrack) return
    await camTrack.setMuted(camOn)
    setCamOn(!camOn)
  }

  return (
    <div className="controls">
      <button onClick={toggleMic}>{micOn ? 'Mute' : 'Unmute'}</button>
      <button onClick={toggleCam}>{camOn ? 'Camera Off' : 'Camera On'}</button>
      {screenTrack
        ? <button onClick={onStopShare}>Stop Share</button>
        : <button onClick={onShare}>Share Screen</button>}
    </div>
  )
}
