import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, ArrowLeft } from 'lucide-react'
import { useSendOtp } from '@/features/auth/useAuthMutations'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const OTP_LENGTH = 6

const VerifyForgotOtp = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const inputRefs = useRef([])

  const email = location.state?.email
  const { mutate: resendOtp, isPending: isResending } = useSendOtp()

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
    }
  }, [email, navigate])

  const focusInput = (index) => inputRefs.current[index]?.focus()

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < OTP_LENGTH - 1) focusInput(index + 1)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        focusInput(index - 1)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) focusInput(index - 1)
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) focusInput(index + 1)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const newOtp = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length < OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }
    navigate(ROUTES.RESET_PASSWORD, {
      state: { email, otp: otpString },
    })
  }

  const handleResend = () => {
    if (!email) return
    resendOtp(
      { email },
      { onSuccess: () => toast.success('OTP resent successfully') }
    )
  }

  if (!email) return null

  const isComplete = otp.join('').length === OTP_LENGTH

  return (
    <div className="bg-card border border-border rounded-[15px] p-8 shadow-card">
      <button
        onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Enter OTP</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5">{email}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`OTP digit ${index + 1}`}
              className={cn(
                'w-11 h-12 text-center text-lg font-bold rounded-md border bg-background',
                'outline-none transition-all duration-150 text-foreground',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                digit ? 'border-primary bg-primary/5' : 'border-input'
              )}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isComplete}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-md text-sm font-medium',
            'bg-primary text-white hover:bg-primary/90 transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          Verify OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-primary font-medium hover:underline disabled:opacity-60"
        >
          {isResending ? 'Sending...' : 'Resend OTP'}
        </button>
      </p>

      <p className="text-center text-xs text-muted-foreground mt-3">
        OTP expires in 5 minutes
      </p>
    </div>
  )
}

export default VerifyForgotOtp