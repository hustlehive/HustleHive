import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useForgotPassword } from '@/features/auth/useAuthMutations'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const COLLEGE_DOMAINS = ['@nsut.ac.in', '@dtu.ac.in', '@igdtuw.ac.in']

const schema = z.object({
  email: z
    .string()
    .email('Enter a valid email')
    .refine(
      (val) => COLLEGE_DOMAINS.some((d) => val.endsWith(d)),
      'Only college email IDs are allowed'
    ),
})

const ForgotPassword = () => {
  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data) => forgotPassword(data)

  return (
    <div className="bg-card border border-border rounded-[15px] p-8 shadow-card">
      <Link
        to={ROUTES.LOGIN}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <div className="mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your college email and we'll send you an OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword