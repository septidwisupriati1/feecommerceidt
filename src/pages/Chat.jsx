import { useMemo, useState } from 'react'
import { useChat } from '../context/ChatContext'

export default function Chat() {
  const { conversations, deleteConversation: deleteChatConversation } = useChat()
  const [active, setActive] = useState(conversations[0]?.id)
  const [text, setText] = useState('')
  const conv = useMemo(() => conversations.find(c => c.id === active), [active, conversations])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    // Here we'd push a message to state or API; demo reset only
    setText('')
  }

  const deleteConversation = (id) => {
    if (window.confirm('Hapus percakapan ini?')) {
      deleteChatConversation(id)
      // If deleted conversation was active, switch to first available
      if (id === active && conversations.length > 1) {
        const remaining = conversations.filter(c => c.id !== id)
        setActive(remaining[0]?.id || null)
      }
    }
  }

  return (
    <section className="container chat-wrap">
      <aside className="chat-sidebar">
        <div className="chat-header">Chat <span className="muted">({conversations.length})</span></div>
        <div className="chat-search">
          <input placeholder="Cari nama" />
          <select>
            <option>Semua</option>
          </select>
        </div>
        <ul className="chat-list">
          {conversations.map(c => (
            <li key={c.id} className={`chat-item ${c.id===active?'active':''}`} onClick={()=>setActive(c.id)}>
              <div className="avatar" />
              <div className="meta">
                <div className="row1">
                  <strong className="name">{c.name}</strong>
                  <span className="date">{c.date}</span>
                </div>
                <div className="row2">
                  <span className="last">{c.last}</span>
                  {!!c.unread && <span className="pill">{c.unread}</span>}
                </div>
              </div>
              <button 
                className="delete-chat-btn" 
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(c.id)
                }}
                title="Hapus percakapan"
                aria-label="Hapus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        <div className="chat-topbar">
          <div className="title">{conv?.name || 'Pilih percakapan'}</div>
        </div>
        <div className="chat-body">
          {/* Empty space / messages would go here */}
        </div>
        <form className="chat-inputbar" onSubmit={send}>
          <input placeholder="Tulis pesan" value={text} onChange={e=>setText(e.target.value)} />
          <div className="tools">
            {/* Emoji */}
            <button type="button" title="Emoji" aria-label="Emoji">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
            </button>
            {/* Image */}
            <button type="button" title="Gambar" aria-label="Gambar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
            {/* Tray/Attachment (as per provided icon) */}
            <button type="button" title="Lampiran" aria-label="Lampiran">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
            </button>
          </div>
          <button className="btn" type="submit" title="Kirim" aria-label="Kirim">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="18" height="18" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            Kirim
          </button>
        </form>
      </main>
    </section>
  )
}
