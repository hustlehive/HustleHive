import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'
import { getCroppedImg } from '@/utils/cropImage'
import { cn } from '@/utils/cn'

const ImageCropper = ({
  open,
  imageSrc,
  aspect = 1,
  onComplete,
  onCancel,
  title = 'Crop Image',
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setIsProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      onComplete(file, previewUrl)
    } catch (err) {
      console.error('Crop failed:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-[15px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cropper area */}
              <div className="relative w-full bg-black" style={{ height: '380px' }}>
                {imageSrc && (
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape={aspect === 1 ? 'round' : 'rect'}
                    showGrid={true}
                    style={{
                      containerStyle: { borderRadius: 0 },
                    }}
                  />
                )}
              </div>

              {/* Zoom slider */}
              <div className="px-5 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  Drag to reposition · Scroll or use slider to zoom
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md transition-colors',
                    'bg-primary text-white hover:bg-primary/90',
                    'disabled:opacity-60 disabled:cursor-not-allowed'
                  )}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Crop & Use
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ImageCropper