import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, X, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

const USER_REASONS = [
    "Spam",
    "Harassment",
    "Scam",
    "Fake Profile",
    "Inappropriate Content",
    "Other"
]

const HUSTLE_REASONS = [
    "Spam",
    "Harassment",
    "Scam",
    "Fake Profile",
    "Inappropriate Content",
    "Other"
]

const ReportDialog = ({ open, onClose, onSubmit, isPending, type = 'user', targetName }) => {
    const [reason, setReason] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const reasons = type === 'user' ? USER_REASONS : HUSTLE_REASONS

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!reason) { setError('Please select a reason'); return }
        if (reason === 'Other' && !description.trim()) {
            setError('Please describe the issue')
            return
        }
        onSubmit({ reason, description: description.trim() })
    }

    const handleClose = () => {
        setReason('')
        setDescription('')
        setError('')
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card border border-border rounded-[15px] w-full max-w-sm shadow-xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-destructive" />
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Report {type === 'user' ? 'User' : 'Hustle'}
                                        {targetName && <span className="text-muted-foreground font-normal"> - {targetName}</span>}
                                    </h3>
                                </div>
                                <button onClick={handleClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Reason <span className="text-destructive">*</span></label>
                                    <div className="space-y-1.5">
                                        {reasons.map((r) => (
                                            <label key={r} className={cn(
                                                'flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm',
                                                reason === r
                                                    ? 'border-primary bg-primary/5 text-foreground'
                                                    : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-accent'
                                            )}>
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={r}
                                                    checked={reason === r}
                                                    onChange={() => { setReason(r); setError('') }}
                                                    className="accent-primary"
                                                />
                                                {r}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {reason === 'Other' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Description <span className="text-destructive">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={description}
                                            onChange={(e) => { setDescription(e.target.value); setError('') }}
                                            placeholder="Please describe the issue..."
                                            className={cn(
                                                'w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground resize-none',
                                                'placeholder:text-muted-foreground outline-none transition-colors',
                                                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                                error ? 'border-destructive' : 'border-input'
                                            )}
                                        />
                                    </div>
                                )}

                                {error && <p className="text-xs text-destructive">{error}</p>}

                                <div className="flex gap-3 justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-60"
                                    >
                                        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ReportDialog