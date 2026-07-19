import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import HustleForm from '@/components/hustle/HustleForm'
import { useHustleById, useUpdateHustle, useDeleteHustle } from '@/features/hustles/useHustles'
import { uploadHustleImage, deleteHustleImage } from '@/api/hustles.api'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useState } from 'react'
import ConfirmDialog from '@/components/common/ConfirmDialog'

const EditHustle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data, isLoading, isError } = useHustleById(id)
  const { mutate: updateHustle, isPending: isUpdating } = useUpdateHustle(id)
  const { mutate: deleteHustle, isPending: isDeleting } = useDeleteHustle()

  const hustle = data?.hustle

  // Guard - only creator can edit
  useEffect(() => {
    if (hustle && user && hustle.createdBy?._id !== user._id) {
      toast.error('You are not authorized to edit this hustle')
      navigate(ROUTES.HUSTLE_DETAILS(id), { replace: true })
    }
  }, [hustle, user, id, navigate])

  const handleSubmit = async ({ title, description, reward, deadline, imageFile, removeImage }) => {
    // Handle image operations first
    if (imageFile) {
      try {
        const formData = new FormData()
        formData.append('image', imageFile)
        await uploadHustleImage(id, formData)
      } catch (err) {
        toast.error('Failed to upload image')
        return
      }
    } else if (removeImage) {
      try {
        await deleteHustleImage(id)
      } catch (err) {
        // Non-critical, continue
      }
    }

    updateHustle(
      { title, description, reward, deadline },
      {
        onSuccess: () => {
          navigate(ROUTES.HUSTLE_DETAILS(id))
        },
      }
    )
  }

  const handleDelete = () => {
    deleteHustle(id, {
      onSuccess: () => {
        navigate(ROUTES.MY_HUSTLES, { replace: true })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-[15px] p-6 space-y-4 animate-pulse">
          <div className="h-48 bg-muted rounded-[12px]" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-24 bg-muted rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !hustle) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Hustle not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Hustle</h1>
            <p className="text-sm text-muted-foreground">Update your hustle details</p>
          </div>
        </div>
        <button
          onClick={() => setDeleteOpen(true)}
          className="px-3 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Form card */}
      <div className="bg-card border border-border rounded-[15px] p-6">
        <HustleForm
          onSubmit={handleSubmit}
          isPending={isUpdating}
          submitLabel="Save Changes"
          defaultValues={{
            title: hustle.title,
            description: hustle.description,
            reward: hustle.reward,
            deadline: hustle.deadline,
            imageUrl: hustle.photo?.url || null,
          }}
        />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete this hustle?"
        description="This will permanently delete the hustle and all its applications. This cannot be undone."
        confirmText="Delete Hustle"
        variant="destructive"
      />
    </div>
  )
}

export default EditHustle