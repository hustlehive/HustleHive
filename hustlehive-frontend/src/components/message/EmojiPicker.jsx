import { useState, useRef, useEffect } from 'react'
import { Smile } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPickerLib from 'emoji-picker-react'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '@/app/slices/themeSlice'
import { cn } from '@/utils/cn'

const EmojiPicker = ({ onEmojiClick }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const themeMode = useSelector(selectThemeMode)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (emojiData) => {
    onEmojiClick(emojiData.emoji)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label="Open emoji picker"
        className={cn(
          'p-2.5 rounded-[12px] text-muted-foreground hover:text-foreground',
          'hover:bg-accent transition-colors',
          open && 'bg-accent text-foreground'
        )}
      >
        <Smile className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 right-0 z-50 shadow-2xl rounded-[15px] overflow-hidden"
          >
            <EmojiPickerLib
              theme={themeMode === 'dark' ? 'dark' : 'light'}
              onEmojiClick={handleSelect}
              width={300}
              height={380}
              previewConfig={{ showPreview: false }}
              searchPlaceHolder="Search emoji..."
              lazyLoadEmojis
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmojiPicker