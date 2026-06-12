import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInboxContacts, fetchMessages, sendMessage, clearActiveThread } from '../redux/slices/messageSlice'
import { toast } from 'react-hot-toast'
import { Send, User as UserIcon, HelpCircle, MessageSquare } from 'lucide-react'
import API from '../services/api'

function MessagesInbox() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const chatWithParam = searchParams.get('chatWith')
  
  const { inboxContacts, activeThread, loading } = useSelector((state) => state.messages)
  const { user } = useSelector((state) => state.auth)

  const [activeContact, setActiveContact] = useState(null)
  const [messageText, setMessageText] = useState('')
  const threadEndRef = useRef(null)

  // Scroll to bottom of message thread on update
  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeThread])

  // Fetch inbox contacts on load
  useEffect(() => {
    dispatch(fetchInboxContacts())
    return () => {
      dispatch(clearActiveThread())
    }
  }, [dispatch])

  // Handle URL query parameter ?chatWith=userId
  useEffect(() => {
    if (chatWithParam) {
      const handleDirectChat = async () => {
        try {
          // Resolve contact details from backend
          const response = await API.get(`/api/auth/me`) // dummy trigger or resolve user details
          const contactUser = await API.get(`/api/messages/${chatWithParam}`) // trigger loading messages
          
          // Fetch user metadata directly
          // We can append contact to list or select it
          setActiveContact({ _id: chatWithParam, name: 'Hiring Coordinator' })
          dispatch(fetchMessages(chatWithParam))
        } catch (err) {
          console.error(err)
        }
      }
      handleDirectChat()
    }
  }, [chatWithParam, dispatch])

  const handleSelectContact = (contact) => {
    setActiveContact(contact)
    dispatch(fetchMessages(contact._id))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !activeContact) return

    try {
      await dispatch(sendMessage({
        receiverId: activeContact._id,
        content: messageText
      })).unwrap()
      setMessageText('')
      dispatch(fetchInboxContacts()) // Refresh inbox list preview
    } catch (err) {
      toast.error(err || "Failed to send message")
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass rounded-2xl shadow-xl overflow-hidden h-[75vh] flex">
        
        {/* Left Sidebar: Contact Inbox list */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white/20">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-sm">Inbox Conversations</h2>
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {inboxContacts.map((contact) => {
              const isSelected = activeContact?._id === contact._id
              return (
                <button
                  key={contact._id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-xs font-bold text-primary flex items-center justify-center dark:bg-blue-400/20 dark:text-blue-400 flex-shrink-0">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate pr-2">{contact.name}</h4>
                      {contact.latestMessageTime && (
                        <span className="text-[8px] text-slate-400 flex-shrink-0">
                          {new Date(contact.latestMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{contact.latestMessage || 'Click to chat'}</p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <span className="h-4 w-4 bg-danger rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </button>
              )
            })}

            {inboxContacts.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                No messages yet
              </div>
            )}
          </div>
        </div>

        {/* Right Active Thread box */}
        <div className="flex-grow flex flex-col bg-slate-50/30 dark:bg-slate-900/10">
          {activeContact ? (
            <>
              {/* Header Contact detail */}
              <div className="p-4 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-xs font-bold text-primary flex items-center justify-center">
                  {activeContact.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">{activeContact.name}</h3>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">{activeContact.role || 'Hiring Team'}</span>
                </div>
              </div>

              {/* Message bubble feed scroll */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {activeThread.map((msg) => {
                  const isOwn = msg.senderId === user?.id || msg.senderId === user?._id
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                        isOwn 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white text-slate-850 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-800'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`block text-[8px] text-right mt-1.5 ${isOwn ? 'text-blue-200' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={threadEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow rounded-lg border border-slate-200 bg-white/50 py-2 px-3 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary p-2 text-white hover:bg-primary-dark shadow transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center text-slate-400 gap-2">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="text-xs italic">Select a contact from the inbox list to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default MessagesInbox
