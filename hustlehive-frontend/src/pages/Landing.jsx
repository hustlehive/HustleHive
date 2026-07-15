import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, MessageSquare, Shield } from 'lucide-react'
import ThemeToggle from '@/components/common/ThemeToggle'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'

const features = [
  {
    icon: Zap,
    title: 'Post Hustles',
    description: 'Create tasks and gigs for your college community. Set your reward and deadline.',
  },
  {
    icon: Users,
    title: 'Connect & Collaborate',
    description: 'Find talented peers from NSUT, DTU, and IGDTUW. Build your network.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description: 'Chat instantly with hustle owners and applicants. Never miss an update.',
  },
  {
    icon: Shield,
    title: 'Verified College Emails',
    description: 'Only students with valid college email IDs can join. Trusted community.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const Landing = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Don't render anything while redirecting
  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-lg tracking-tight">HustleHive</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to={ROUTES.LOGIN}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              For NSUT, DTU & IGDTUW Students
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Your College's
              <span className="text-primary"> Micro-Gig </span>
              Marketplace
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Post hustles, find talent, earn rewards — all within your verified college community.
              Connect with peers, collaborate on projects, and build your network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors text-sm w-full sm:w-auto justify-center"
              >
                Start Hustling
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-md hover:bg-accent transition-colors text-sm w-full sm:w-auto justify-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Everything you need to hustle
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              A complete platform built specifically for college students to find work,
              hire peers, and grow professionally.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="p-6 rounded-[15px] bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{feature.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to find your next hustle?
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Join hundreds of college students already using HustleHive.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HustleHive. Built for college hustlers.
      </footer>
    </div>
  )
}

export default Landing