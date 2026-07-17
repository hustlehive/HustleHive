import { useRef, useState } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import ImageCropper from './ImageCropper'

const ImageUploader = ({
  value,
  onChange,
  onRemove,
  className,
  aspect = 16 / 9,
  cropTitle = 'Crop Hustle Image',
}) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState(null)
  const [cropperOpen, setCropperOpen] = useState(false)

  const validateAndOpenCropper = (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setRawImageSrc(e.target.result)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    validateAndOpenCropper(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    validateAndOpenCropper(e.dataTransfer.files?.[0])
  }

  const handleCropComplete = (file, previewUrl) => {
    setCropperOpen(false)
    setRawImageSrc(null)
    onChange(file, previewUrl)
  }

  const handleCropCancel = () => {
    setCropperOpen(false)
    setRawImageSrc(null)
  }

  return (
    <>
      <div className={cn('relative', className)}>
        {value ? (
          <div className="relative rounded-[12px] overflow-hidden border border-border">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-foreground text-xs font-medium rounded-md hover:bg-white/90 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              'flex flex-col items-center justify-center h-48 rounded-[12px] border-2 border-dashed cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            )}
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Image className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop image here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP · Max 10MB · Optional
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Cropper modal */}
      <ImageCropper
        open={cropperOpen}
        imageSrc={rawImageSrc}
        aspect={aspect}
        title={cropTitle}
        onComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </>
  )
}

export default ImageUploader