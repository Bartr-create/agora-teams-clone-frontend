import React, { useEffect, useRef, useState } from 'react'

export default function ChatPanel({ socket }) {
  const [log, setLog] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!socket) return
    const onMsg = (ev) => {
      const data = JSON.parse(ev.data)
      if (data.type === 'chat' || data.type === 'system') {
        setLog(prev => [...prev, data])
      }
    }
    socket.addEventListener('message', onMsg)
    const ping = setInterval(() => socket.readyState===1 && socket.send(JSON.stringify({type:'ping'})), 30000)
    return () => { socket.removeEventListener('message', onMsg); clearInterval(ping) }
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:'smooth'})
  }, [log])

  const send = () => {
    if (!text.trim() || !socket || socket.readyState!==1) return
    socket.send(JSON.stringify({ type: 'chat', text }))
    setText('')
  }

  return (
    <div className="chat">
      <div className="messages">
        {log.map((m,i)=>(
          <div key={i} className={m.type}>
            {m.type==='chat' ? (<><b>{m.from}:</b> {m.text}</>) : (<i>{m.text}</i>)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="composer">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..."/>
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
