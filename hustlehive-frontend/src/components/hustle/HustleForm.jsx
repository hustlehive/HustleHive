import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import ImageUploader from '@/components/common/ImageUploader'

const hustleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  reward: z
    .string()
    .min(1, 'Reward is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, 'Enter a valid reward amount'),
  deadline: z.string().min(1, 'Deadline is required'),
})

const HustleForm = ({ onSubmit, isPending, defaultValues, submitLabel = 'Create Hustle' }) => {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(defaultValues?.imageUrl || null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hustleSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      reward: defaultValues?.reward?.toString() || '',
      deadline: defaultValues?.deadline
        ? new Date(defaultValues.deadline).toISOString().split('T')[0]
        : '',
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title || '',
        description: defaultValues.description || '',
        reward: defaultValues.reward?.toString() || '',
        deadline: defaultValues.deadline
          ? new Date(defaultValues.deadline).toISOString().split('T')[0]
          : '',
      })
      setImagePreview(defaultValues.imageUrl || null)
    }
  }, [defaultValues, reset])

  const handleImageChange = (file, preview) => {
    setImageFile(file)
    setImagePreview(preview)
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      reward: Number(data.reward),
      imageFile,
      removeImage: imagePreview === null && !!defaultValues?.imageUrl,
    })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Hustle Image <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <ImageUploader
          value={imagePreview}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
        />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Need someone to design a logo for my startup"
          {...register('title')}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
            'placeholder:text-muted-foreground outline-none transition-colors',
            'focus:ring-2 focus:ring-primary/30 focus:border-primary',
            errors.title ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe what you need done, any requirements, and what the deliverable should look like..."
          {...register('description')}
          className={cn(
            'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
            'placeholder:text-muted-foreground outline-none transition-colors resize-none',
            'focus:ring-2 focus:ring-primary/30 focus:border-primary',
            errors.description ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Reward + Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="reward" className="text-sm font-medium text-foreground">
            Reward (₹) <span className="text-destructive">*</span>
          </label>
          <input
            id="reward"
            type="number"
            min="0"
            placeholder="500"
            {...register('reward')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'placeholder:text-muted-foreground outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.reward ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.reward && (
            <p className="text-xs text-destructive">{errors.reward.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="deadline" className="text-sm font-medium text-foreground">
            Deadline <span className="text-destructive">*</span>
          </label>
          <input
            id="deadline"
            type="date"
            min={today}
            {...register('deadline')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.deadline ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.deadline && (
            <p className="text-xs text-destructive">{errors.deadline.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium',
          'bg-primary text-white hover:bg-primary/90 transition-colors',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}

export default HustleForm