import React, { useEffect, useState } from 'react'

export default function ParticipantsPanel({ socket }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!socket) return
    const onMsg = (ev) => {
      const data = JSON.parse(ev.data)
      if (data.type === 'participants') setUsers(data.participants || [])
    }
    socket.addEventListener('message', onMsg)
    return () => socket.removeEventListener('message', onMsg)
  }, [socket])

  return (
    <div className="participants">
      <h3>Participants ({users.length})</h3>
      <ul>{users.map(u => <li key={u}>{u}</li>)}</ul>
    </div>
  )
}
