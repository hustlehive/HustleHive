import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useLogin } from '@/features/auth/useAuthMutations'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = (data) => login(data)

  return (
    <div className="bg-card border border-border rounded-[15px] p-8 shadow-card">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your HustleHive account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Identifier */}
        <div className="space-y-1.5">
          <label
            htmlFor="identifier"
            className="text-sm font-medium text-foreground"
          >
            Email or Username
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="john@nsut.ac.in or johndoe"
            {...register('identifier')}
            className={cn(
              'w-full px-3 py-2.5 text-sm rounded-md border bg-background text-foreground',
              'placeholder:text-muted-foreground outline-none transition-colors',
              'focus:ring-2 focus:ring-primary/30 focus:border-primary',
              errors.identifier ? 'border-destructive' : 'border-input'
            )}
          />
          {errors.identifier && (
            <p className="text-xs text-destructive">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
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
            'w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-md text-sm font-medium',
            'bg-primary text-white hover:bg-primary/90 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login