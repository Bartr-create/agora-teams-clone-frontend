import React, { useEffect, useRef } from 'react'

export default function VideoGrid({ localCam, remoteUsers }) {
  return (
    <div className="grid">
      <VideoTile track={localCam} label="You" />
      {remoteUsers.map(u => (
        <VideoTile key={u.uid} track={u.videoTrack} label={`User ${u.uid}`} />
      ))}
    </div>
  )
}

function VideoTile({ track, label }) {
  const ref = useRef(null)
  useEffect(() => {
    if (track && ref.current) track.play(ref.current)
    return () => { if (track) track.stop() }
  }, [track])
  return (
    <div className="tile">
      <div ref={ref} className="video"></div>
      <div className="label">{label}</div>
    </div>
  )
}
