import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const ImageLightbox = ({ open, src, alt, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm cursor-pointer"
          />

          {/* Lightbox window - centered square dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative pointer-events-auto bg-black rounded-[15px] overflow-hidden shadow-2xl"
              style={{
                width: 'min(90vw, 90vh)',
                height: 'min(90vw, 90vh)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                aria-label="Close image"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image - original dimensions, centered, contained within square */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={src}
                  alt={alt || 'Hustle image'}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ImageLightbox