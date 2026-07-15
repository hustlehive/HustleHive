import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Upload, X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useSendOtp } from '@/features/auth/useAuthMutations'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const COLLEGE_DOMAINS = ['@nsut.ac.in', '@dtu.ac.in', '@igdtuw.ac.in']

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Enter a valid email')
    .refine(
      (val) => COLLEGE_DOMAINS.some((d) => val.endsWith(d)),
      'Only @nsut.ac.in, @dtu.ac.in, or @igdtuw.ac.in emails are allowed'
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)

  const { mutate: sendOtp, isPending } = useSendOtp()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = (data) => {
    sendOtp(
      { email: data.email },
      {
        onSuccess: () => {
          toast.success('OTP sent to your email')
          navigate(ROUTES.REGISTER_VERIFY, {
            state: {
              formData: data,
              imageFile,
            },
          })
        },
      }
    )
  }

  return (
    <div className="bg-card border border-border rounded-[15px] p-8 shadow-card">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Join HustleHive with your college email
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className={cn(
                'cursor-pointer text-xs font-medium text-primary hover:underline block mb-1'
              )}
            >
              {imagePreview ? 'Change photo' : 'Upload photo'}
            </label>
            <p className="text-[11px] text-muted-foreground">
              JPG, PNG, WEBP
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register('fullName')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'placeholder:text-muted-foreground outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.fullName ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            {...register('username')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'placeholder:text-muted-foreground outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.username ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            College Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@nsut.ac.in"
            autoComplete="email"
            {...register('email')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'placeholder:text-muted-foreground outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.email ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Accepted: @nsut.ac.in · @dtu.ac.in · @igdtuw.ac.in
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              {...register('password')}
              className={cn(
                'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground pr-10',
                'placeholder:text-muted-foreground outline-none transition-colors',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                errors.password ? 'border-destructive' : 'border-input'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'w-full flex items-center justify-center gap-2 mt-2',
            'px-4 py-2.5 rounded-md text-sm font-medium',
            'bg-primary text-white hover:bg-primary/90 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Continue
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register