import { useState } from 'react'
import { Check, X, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import AppAvatar from '@/components/common/AppAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { getRelativeTime } from '@/utils/getRelativeTime'
import { useAcceptApplication, useRejectApplication } from '@/features/hustles/useHustles'
import { startConversation } from '@/api/messages.api'
import { ROUTES } from '@/constants/routes'
import { queryKeys } from '@/constants/queryKeys'
import { cn } from '@/utils/cn'

const ApplicantCard = ({ application, hustleId, hustleStatus }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [acceptOpen, setAcceptOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [isStartingConversation, setIsStartingConversation] = useState(false)

  const { mutate: accept, isPending: isAccepting } = useAcceptApplication()
  const { mutate: reject, isPending: isRejecting } = useRejectApplication()

  const { _id, applicant, status, createdAt } = application

  const handleAccept = () => {
    accept(_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.applicants(hustleId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.hustle(hustleId) })
        setAcceptOpen(false)
      },
    })
  }

  const handleReject = () => {
    reject(_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.applicants(hustleId) })
        setRejectOpen(false)
      },
    })
  }

  const handleMessage = async () => {
    // Owner is messaging applicant
    // Per backend contract: participantId = applicant's id (the other person)
    setIsStartingConversation(true)
    try {
      const data = await startConversation({
        type: 'hustle',
        hustleId,
        participantId: applicant._id || applicant.id,
      })
      navigate(ROUTES.CONVERSATION(data.conversation._id))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsStartingConversation(false)
    }
  }

  const canAct = status === 'pending' && hustleStatus === 'active'

  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-[12px] hover:border-primary/20 transition-colors">
        <AppAvatar src={applicant?.profilePic?.url} name={applicant?.fullName} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">
              {applicant?.fullName}
            </p>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground">
            @{applicant?.username} · {applicant?.college}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Applied {getRelativeTime(createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Message — visible once accepted */}
          {status === 'accepted' && (
            <button
              onClick={handleMessage}
              disabled={isStartingConversation}
              title="Message applicant"
              className="p-2 rounded-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
            >
              {isStartingConversation ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
            </button>
          )}

          {canAct && (
            <>
              <button
                onClick={() => setAcceptOpen(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  'bg-emerald-500 text-white hover:bg-emerald-600'
                )}
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  'border border-destructive/30 text-destructive hover:bg-destructive/10'
                )}
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onConfirm={handleAccept}
        isPending={isAccepting}
        title="Accept this applicant?"
        description="All other applications for this hustle will be automatically rejected."
        confirmText="Accept"
        variant="default"
      />

      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        isPending={isRejecting}
        title="Reject this application?"
        description="The applicant will be notified that their application was not selected."
        confirmText="Reject"
        variant="destructive"
      />
    </>
  )
}

export default ApplicantCard