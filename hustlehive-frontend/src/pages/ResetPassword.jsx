import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'
import { useResetPassword } from '@/features/auth/useAuthMutations'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const schema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const email = location.state?.email
  const otp = location.state?.otp

  const { mutate: resetPassword, isPending } = useResetPassword()

  useEffect(() => {
    if (!email || !otp) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
    }
  }, [email, otp, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = (data) => {
    resetPassword({ email, otp, newPassword: data.newPassword })
  }

  if (!email || !otp) return null

  return (
    <div className="bg-card border border-border rounded-[15px] p-8 shadow-card">
      <button
        onClick={() => navigate(ROUTES.FORGOT_PASSWORD_VERIFY, { state: { email } })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              {...register('newPassword')}
              className={cn(
                'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground pr-10',
                'placeholder:text-muted-foreground outline-none transition-colors',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                errors.newPassword ? 'border-destructive' : 'border-input'
              )}
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className={cn(
                'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground pr-10',
                'placeholder:text-muted-foreground outline-none transition-colors',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                errors.confirmPassword ? 'border-destructive' : 'border-input'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-md text-sm font-medium',
            'bg-primary text-white hover:bg-primary/90 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword