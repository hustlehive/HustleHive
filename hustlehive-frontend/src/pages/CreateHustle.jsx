import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import HustleForm from '@/components/hustle/HustleForm'
import { useCreateHustle } from '@/features/hustles/useHustles'
import { uploadHustleImage } from '@/api/hustles.api'
import { ROUTES } from '@/constants/routes'

const CreateHustle = () => {
  const navigate = useNavigate()
  const { mutate: createHustle, isPending } = useCreateHustle()

  const handleSubmit = async ({ title, description, reward, deadline, imageFile }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('reward', reward)
    formData.append('deadline', deadline)
    if (imageFile) formData.append('image', imageFile)

    createHustle(formData, {
      onSuccess: (data) => {
        navigate(ROUTES.HUSTLE_DETAILS(data.hustle._id))
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Create a Hustle</h1>
          <p className="text-sm text-muted-foreground">
            Post a task and find the right person for it
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-card border border-border rounded-[15px] p-6">
        <HustleForm
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Post Hustle"
        />
      </div>
    </div>
  )
}

export default CreateHustle