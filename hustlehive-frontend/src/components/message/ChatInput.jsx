import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/utils/cn'

const ChatInput = ({ onSend, isPending, disabled }) => {
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim() || isPending || disabled) return
    onSend(content.trim())
    setContent('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    setContent(el.value)
  }

  return (
    <div className="border-t border-border bg-card px-4 py-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select a conversation to start chatting' : 'Type a message... (Enter to send)'}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 px-4 py-2.5 text-sm rounded-[12px] border border-input bg-background',
            'text-foreground placeholder:text-muted-foreground',
            'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'resize-none transition-colors leading-relaxed',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ height: '42px', maxHeight: '120px', overflowY: 'auto' }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isPending || disabled}
          className={cn(
            'p-2.5 rounded-[12px] transition-colors shrink-0',
            content.trim() && !disabled
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
      <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}

export default ChatInput