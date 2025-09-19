import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createClient, joinAndPublish, startScreenShare, stopTrack } from '../sdk/agora'
import VideoGrid from '../components/VideoGrid'
import Controls from '../components/Controls'
import ChatPanel from '../components/ChatPanel'
import ParticipantsPanel from '../components/ParticipantsPanel'

const APP_ID = import.meta.env.VITE_AGORA_APP_ID
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Room() {
  const params = new URLSearchParams(window.location.search)
  const channel = params.get('channel') || localStorage.getItem('channel')
  const username = localStorage.getItem('username') || `user_${Math.floor(Math.random()*10000)}`

  const client = useMemo(() => createClient(), [])
  const [micTrack, setMicTrack] = useState(null)
  const [camTrack, setCamTrack] = useState(null)
  const [screenTrack, setScreenTrack] = useState(null)
  const [remoteUsers, setRemoteUsers] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!APP_ID || !channel) return alert('Missing APP_ID or channel')

    // Agora join
    let mounted = true
    ;(async () => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video') setRemoteUsers(prev => [...new Set([...prev, user])])
        if (mediaType === 'audio') user.audioTrack && user.audioTrack.play()
      })
      client.on('user-unpublished', (user, mediaType) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
      })
      client.on('user-left', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
      })

      const { micTrack, camTrack } = await joinAndPublish(client, APP_ID, channel)
      if (!mounted) return
      setMicTrack(micTrack)
      setCamTrack(camTrack)
    })()

    // WS join (chat + presence)
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${proto}://${BACKEND_URL.replace(/^https?:\/\//,'')}/ws/${encodeURIComponent(channel)}?username=${encodeURIComponent(username)}`)
    setSocket(ws)

    return () => {
      mounted = false
      try { ws.close() } catch {}
      ;(async () => {
        await stopTrack(client, screenTrack)
        await stopTrack(client, camTrack)
        await stopTrack(client, micTrack)
        try { await client.leave() } catch {}
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, channel])

  const onShare = async () => {
    const st = await startScreenShare(client)
    setScreenTrack(st)
    st.on('track-ended', async () => { await onStopShare() })
  }

  const onStopShare = async () => {
    await stopTrack(client, screenTrack)
    setScreenTrack(null)
  }

  return (
    <div className="room">
      <header>
        <h2>{channel}</h2>
        <span className="user">You: {username}</span>
      </header>
      <div className="layout">
        <VideoGrid localCam={camTrack} remoteUsers={remoteUsers} />
        <div className="sidebar">
          <Controls micTrack={micTrack} camTrack={camTrack} screenTrack={screenTrack} onShare={onShare} onStopShare={onStopShare} />
          <ParticipantsPanel socket={socket} />
          <ChatPanel socket={socket} />
        </div>
      </div>
    </div>
  )
}
