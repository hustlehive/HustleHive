import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isPending = false,
  variant = 'destructive',
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-[15px] p-6 w-full max-w-sm shadow-xl"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'
                )}>
                  <AlertTriangle className={cn(
                    'w-5 h-5',
                    variant === 'destructive' ? 'text-destructive' : 'text-primary'
                  )} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-60"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isPending}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-60 flex items-center gap-2',
                    variant === 'destructive'
                      ? 'bg-destructive text-white hover:bg-destructive/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  )}
                >
                  {isPending && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog