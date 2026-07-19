import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Users, Zap } from 'lucide-react'
import { useInbox } from '@/features/messages/useMessages'
import ConversationItem from '@/components/message/ConversationItem'
import ChatWindow from '@/components/message/ChatWindow'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const TABS = [
  { id: 'all', label: 'All', icon: MessageSquare },
  { id: 'friend', label: 'Friends', icon: Users },
  { id: 'hustle', label: 'Hustles', icon: Zap },
]

const ConversationListSkeleton = () => (
  <div className="space-y-1 p-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg animate-pulse">
        <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-muted rounded w-28" />
          <div className="h-3 bg-muted rounded w-40" />
        </div>
      </div>
    ))}
  </div>
)

const Inbox = () => {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const { data, isLoading } = useInbox()

  const allConversations = (data?.inbox || []).filter(
    (c) => c.conversationId && c.user && c.user.fullName
  )

  // Filter by tab
  const conversations = activeTab === 'all'
    ? allConversations
    : allConversations.filter((c) => c.type === activeTab)

  // Count badges
  const friendCount = allConversations.filter((c) => c.type === 'friend').length
  const hustleCount = allConversations.filter((c) => c.type === 'hustle').length
  const friendUnread = allConversations.filter((c) => c.type === 'friend' && c.unreadCount > 0).length
  const hustleUnread = allConversations.filter((c) => c.type === 'hustle' && c.unreadCount > 0).length

  // Find active conversation - match by conversationId field
  const activeConversation = allConversations.find(
    (c) => c.conversationId === conversationId
  ) || null

  const handleSelectConversation = (conv) => {
    navigate(ROUTES.CONVERSATION(conv.conversationId))
  }

  const handleBack = () => {
    navigate(ROUTES.INBOX)
  }

  const showList = !conversationId
  const showChat = !!conversationId

  const getTabUnreadBadge = (tabId) => {
    if (tabId === 'friend') return friendUnread
    if (tabId === 'hustle') return hustleUnread
    return friendUnread + hustleUnread
  }

  const getEmptyMessage = () => {
    if (activeTab === 'friend') return 'No friend conversations yet. Message a friend from the Friends page.'
    if (activeTab === 'hustle') return 'No hustle conversations yet. Accept an applicant on your hustle to start chatting.'
    return 'No conversations yet. Start one from a hustle or a friend\'s profile.'
  }

  return (
    <div
      className="flex bg-background border border-border overflow-hidden w-full"
      style={{ height: '100%' }}
    >
      {/* Left panel */}
      <div
        className={cn(
          'flex flex-col border-r border-border bg-card',
          'w-full md:w-[300px] lg:w-[320px] shrink-0',
          showChat ? 'hidden md:flex' : 'flex'
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Messages</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {allConversations.length}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {TABS.map((tab) => {
              const unread = getTabUnreadBadge(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {unread > 0 && (
                    <span className="min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <ConversationListSkeleton />
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
              <MessageSquare className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  No conversations
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getEmptyMessage()}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.conversationId}
                  conversation={conv}
                  isActive={conv.conversationId === conversationId}
                  onClick={() => handleSelectConversation(conv)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right - Chat window */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          showList ? 'hidden md:flex' : 'flex'
        )}
      >
        <ChatWindow
          conversation={activeConversation}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}

export default Inbox