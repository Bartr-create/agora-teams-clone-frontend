import React, { useState } from 'react'

export default function Join() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [channel, setChannel] = useState(localStorage.getItem('channel') || '')

  const onJoin = (e) => {
    e.preventDefault()
    if (!username || !channel) return alert('Enter username & channel')
    localStorage.setItem('username', username)
    localStorage.setItem('channel', channel)
    window.location.href = `/room?channel=${encodeURIComponent(channel)}`
  }

  return (
    <div className="join">
      <h1>Join a Meeting</h1>
      <form onSubmit={onJoin}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Temporary username" />
        <input value={channel} onChange={e=>setChannel(e.target.value)} placeholder="Channel name" />
        <button type="submit">Join</button>
      </form>
      <p className="hint">Uses Agora App ID + Channel (no token).</p>
    </div>
  )
}
