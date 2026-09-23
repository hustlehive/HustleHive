import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, Bot } from 'lucide-react'
import { getHustleById } from '@/api/hustles.api'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const AIResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { answer, sources, question } = location.state || {}
  const [hustles, setHustles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sources?.length) return
    setLoading(true)
    Promise.all(
      sources.map((s) =>
        getHustleById(s.hustleId)
          .then((d) => d?.hustle || null)
          .catch(() => null)
      )
    )
      .then((results) => setHustles(results.filter(Boolean)))
      .finally(() => setLoading(false))
  }, [])

  if (!answer && !sources) {
    navigate(ROUTES.DASHBOARD, { replace: true })
    return null
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Question */}
      <div className="bg-primary/5 border border-primary/20 rounded-[15px] p-5 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">You asked</p>
            <p className="text-sm font-medium text-foreground">{question}</p>
          </div>
        </div>
      </div>

      {/* AI Answer */}
      <div className="bg-card border border-border rounded-[15px] p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">HustleHive AI</p>
            <p className="text-sm text-foreground leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>

      {/* Related Hustles */}
      {(loading || hustles.length > 0) && (
        <>
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Related Hustles
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => <HustleCardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {hustles.map((h) => (
                <HustleCard key={h._id} hustle={h} />
              ))}
            </motion.div>
          )}
        </>
      )}

      {!loading && hustles.length === 0 && sources?.length > 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No matching hustles found on the platform currently.
        </p>
      )}
    </div>
  )
}

export default AIResults