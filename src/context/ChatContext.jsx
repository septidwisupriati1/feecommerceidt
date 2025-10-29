import { createContext, useContext, useState } from 'react'

const ChatContext = createContext()

// Initial mock conversations
const initialConversations = [
  { id: 1, name: 'Kickchickclo...', last: 'Jenis pesan tidak d...', date: '29/05/23', unread: 1 },
  { id: 2, name: 'Luck Wanita ...', last: 'Besok akan menjad...', date: '24/02/23', unread: 1 },
  { id: 3, name: 'Beeyoo Offic...', last: 'Wah selera Kakak ...', date: '23/02/23', unread: 1 },
  { id: 4, name: 'GarmentMarts', last: 'DISKON 80% khus...', date: '09/02/23', unread: 2 },
  { id: 5, name: 'ichibanokashi', last: 'Hi, Terima Kasih ...', date: '08/02/23', unread: 1 },
]

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(initialConversations)

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
  }

  const addConversation = (conversation) => {
    setConversations(prev => [conversation, ...prev])
  }

  const updateConversation = (id, updates) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    )
  }

  const getTotalUnread = () => {
    return conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0)
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      deleteConversation,
      addConversation,
      updateConversation,
      getTotalUnread,
      conversationCount: conversations.length
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
