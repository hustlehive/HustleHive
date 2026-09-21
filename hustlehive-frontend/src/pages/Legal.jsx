import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Lock,
  AlertTriangle,
  Heart,
  Eye,
  MessageSquare,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import ThemeToggle from '@/components/common/ThemeToggle'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'

const TABS = [
  { id: 'guidelines', label: 'Community Guidelines', icon: BookOpen },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
]

const Section = ({ icon: Icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border rounded-[15px] overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between p-5 hover:bg-accent transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed space-y-3 border-t border-border pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Highlight = ({ children, variant = 'warning' }) => (
  <div className={cn(
    'flex items-start gap-3 p-4 rounded-[12px] border',
    variant === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    variant === 'danger' && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    variant === 'info' && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    variant === 'success' && 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  )}>
    <AlertTriangle className={cn(
      'w-4 h-4 shrink-0 mt-0.5',
      variant === 'warning' && 'text-yellow-600 dark:text-yellow-400',
      variant === 'danger' && 'text-red-600 dark:text-red-400',
      variant === 'info' && 'text-blue-600 dark:text-blue-400',
      variant === 'success' && 'text-emerald-600 dark:text-emerald-400',
    )} />
    <p className={cn(
      'text-xs leading-relaxed',
      variant === 'warning' && 'text-yellow-800 dark:text-yellow-300',
      variant === 'danger' && 'text-red-800 dark:text-red-300',
      variant === 'info' && 'text-blue-800 dark:text-blue-300',
      variant === 'success' && 'text-emerald-800 dark:text-emerald-300',
    )}>
      {children}
    </p>
  </div>
)

const GuidelinesTab = () => (
  <div className="space-y-4">
    <Highlight variant="info">
      HustleHive is a verified college platform. Every user is a real student from NSUT, DTU, or IGDTUW. Treat everyone with the same respect you would expect in person.
    </Highlight>

    <Section icon={Zap} title="What is HustleHive?" defaultOpen>
      <p>
        HustleHive is a micro-gig marketplace built exclusively for college students. It allows you to post tasks (hustles), apply for hustles posted by peers, connect with fellow students, and communicate securely — all within a verified college community.
      </p>
      <p>
        The platform is designed to help students earn, collaborate, and build professional connections while still in college. It is not a general-purpose social network or a freelancing platform for the public.
      </p>
    </Section>

    <Section icon={Heart} title="Be Respectful & Professional">
      <p>
        All interactions on HustleHive — including hustle descriptions, messages, and profile information — must maintain a professional and respectful tone.
      </p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li>Treat every user with dignity regardless of their college, gender, background, or skill level.</li>
        <li>Do not use offensive, abusive, discriminatory, or threatening language anywhere on the platform.</li>
        <li>Disagreements should be resolved respectfully. Harassment of any kind will result in immediate account suspension.</li>
        <li>Do not post fake reviews, misleading hustle descriptions, or false credentials.</li>
      </ul>
    </Section>

    <Section icon={MessageSquare} title="Messaging Guidelines">
      <p>
        All messages on HustleHive are end-to-end encrypted. While this means your conversations are private between you and the recipient, encryption does not make harmful content acceptable.
      </p>
      <Highlight variant="danger">
        You must not share, request, or promote: explicit or sexual content, violence or threats, illegal activities, personal confidential data of others, or content that violates any law.
      </Highlight>
      <ul className="list-disc list-inside space-y-1.5 mt-3">
        <li>Do not share your own or others' Aadhaar numbers, bank details, passwords, or sensitive personal information over chat.</li>
        <li>Do not send unsolicited messages or spam any user.</li>
        <li>Hustle conversations must remain relevant to the hustle. Do not misuse hustle conversations for unrelated purposes.</li>
        <li>Do not use the messaging system to coordinate anything illegal or harmful.</li>
      </ul>
    </Section>

    <Section icon={Zap} title="Hustle Posting Rules">
      <ul className="list-disc list-inside space-y-1.5">
        <li>Post only genuine tasks that you intend to complete or pay for. Fake or misleading hustles will be removed.</li>
        <li>Set fair and honest reward amounts. Do not bait applicants with inflated rewards and then renegotiate.</li>
        <li>Hustles must not involve illegal, unethical, or harmful activities of any kind.</li>
        <li>Do not post hustles that require another person to share confidential information, perform dangerous tasks, or violate anyone's privacy.</li>
        <li>Once you accept an applicant, honour your commitment. Repeated abandonment of accepted hustles may result in account restrictions.</li>
        <li>Hustle images must be relevant and appropriate. No explicit, offensive, or misleading images.</li>
      </ul>
      <Highlight variant="warning">
        Posting hustles that promote academic dishonesty (e.g. writing assignments for others, completing exams) is strictly prohibited and will result in permanent account ban.
      </Highlight>
    </Section>

    <Section icon={Users} title="Friend & Connection Rules">
      <ul className="list-disc list-inside space-y-1.5">
        <li>Only send friend requests to people you know or have interacted with professionally on the platform.</li>
        <li>Do not send bulk or spam friend requests to strangers.</li>
        <li>Respect it when someone rejects your friend request. Do not repeatedly send requests to the same person.</li>
        <li>Do not impersonate other students or create fake profiles.</li>
      </ul>
    </Section>

    <Section icon={Eye} title="Content & Images">
      <ul className="list-disc list-inside space-y-1.5">
        <li>Profile pictures must be appropriate and ideally a real photo of yourself.</li>
        <li>Hustle images must be relevant to the task. No nudity, violence, or graphic content.</li>
        <li>Do not upload copyrighted images without permission.</li>
        <li>Any content that promotes hatred, discrimination, or violence will be removed immediately.</li>
      </ul>
      <Highlight variant="danger">
        Uploading or sharing any form of explicit, pornographic, or sexually suggestive content is a permanent ban offence with no appeal.
      </Highlight>
    </Section>

    <Section icon={AlertTriangle} title="What Happens if You Violate Guidelines">
      <p>
        HustleHive administrators actively monitor the platform for violations. Depending on the severity:
      </p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li><strong className="text-foreground">Warning:</strong> Minor first-time violations may receive a warning.</li>
        <li><strong className="text-foreground">Temporary Suspension:</strong> Repeated or moderate violations result in temporary account suspension.</li>
        <li><strong className="text-foreground">Permanent Ban:</strong> Severe violations (explicit content, illegal activity, harassment) result in immediate permanent account deletion.</li>
        <li>Banned users may not re-register with the same email or any new college email.</li>
      </ul>
      <p className="mt-2">
        If you believe a user is violating these guidelines, please contact the platform administrators directly.
      </p>
    </Section>

    <Section icon={Heart} title="Our Commitment to You">
      <p>
        HustleHive is built by students, for students. We are committed to maintaining a safe, respectful, and productive environment where you can genuinely grow your skills, earn, and connect with your college community.
      </p>
      <p>
        We continuously improve the platform based on your feedback. If you have suggestions, concerns, or encounter any issues, please reach out to the admin team.
      </p>
      <Highlight variant="success">
        By using HustleHive, you agree to uphold these community standards and contribute to a positive campus ecosystem.
      </Highlight>
    </Section>
  </div>
)

const PrivacyTab = () => (
  <div className="space-y-4">
    <Highlight variant="info">
      Last updated: July 2026. This Privacy Policy applies to all users of HustleHive and governs how we collect, use, and protect your data.
    </Highlight>

    <Section icon={Shield} title="What Data We Collect" defaultOpen>
      <p>When you create an account and use HustleHive, we collect the following information:</p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li><strong className="text-foreground">Account Information:</strong> Full name, username, college email address, college name, and profile picture.</li>
        <li><strong className="text-foreground">Hustle Data:</strong> Hustles you create, applications you submit, and application decisions.</li>
        <li><strong className="text-foreground">Connection Data:</strong> Friend requests sent and received, accepted friendships.</li>
        <li><strong className="text-foreground">Message Metadata:</strong> Conversation participants, timestamps, and read receipts. Message content is end-to-end encrypted.</li>
        <li><strong className="text-foreground">Usage Data:</strong> Pages visited, features used, and device/browser information for improving the platform.</li>
      </ul>
    </Section>

    <Section icon={Lock} title="End-to-End Encryption">
      <p>
        All messages sent through HustleHive are protected by end-to-end encryption. This means only you and the person you are communicating with can read the message content.
      </p>
      <Highlight variant="warning">
        While message content is encrypted and not accessible to HustleHive staff, we can still see message metadata such as who spoke to whom and when. Encryption protects content — not the fact that a conversation occurred.
      </Highlight>
      <p>
        We strongly advise against sharing sensitive personal information (bank details, passwords, government IDs) over any messaging system, including ours.
      </p>
    </Section>

    <Section icon={Eye} title="How We Use Your Data">
      <ul className="list-disc list-inside space-y-1.5">
        <li>To provide and improve the HustleHive platform and its features.</li>
        <li>To verify your college identity and maintain platform integrity.</li>
        <li>To send you notifications about hustle applications, friend requests, and messages.</li>
        <li>To detect and prevent fraud, abuse, and policy violations.</li>
        <li>To generate anonymised, aggregated statistics about platform usage (no personal data is shared).</li>
      </ul>
      <Highlight variant="success">
        We do not sell your personal data to any third party. We do not use your data for advertising purposes.
      </Highlight>
    </Section>

    <Section icon={Users} title="Data Sharing">
      <p>We share your data only in the following limited circumstances:</p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li><strong className="text-foreground">Other Users:</strong> Your public profile (name, username, college, profile picture, bio) is visible to other verified HustleHive users.</li>
        <li><strong className="text-foreground">Hustle Applicants & Owners:</strong> When you apply to a hustle or accept an applicant, relevant profile information is shared between parties.</li>
        <li><strong className="text-foreground">Cloud Storage:</strong> Profile pictures and hustle images are stored on Cloudinary. Only the public URL is stored in our database.</li>
        <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose data if required by law or in response to valid legal processes.</li>
      </ul>
    </Section>

    <Section icon={Shield} title="Data Storage & Security">
      <ul className="list-disc list-inside space-y-1.5">
        <li>All data is stored on secured servers. Passwords are hashed using bcrypt and are never stored in plain text.</li>
        <li>Authentication uses JWT tokens which expire after a set period (30 days of inactivity).</li>
        <li>Images are stored on Cloudinary with secure access controls.</li>
        <li>We use industry-standard HTTPS encryption for all data transmitted between your browser and our servers.</li>
        <li>Access to the database is restricted to authorised administrators only.</li>
      </ul>
      <Highlight variant="warning">
        No system is 100% secure. While we take every reasonable precaution, we cannot guarantee absolute security of your data. Please use strong, unique passwords and do not share your account credentials.
      </Highlight>
    </Section>

    <Section icon={Eye} title="Your Rights">
      <p>As a HustleHive user, you have the following rights regarding your data:</p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li><strong className="text-foreground">Access:</strong> You can view all your profile information, hustles, and applications within the platform.</li>
        <li><strong className="text-foreground">Edit:</strong> You can update your profile name, bio, username, and profile picture at any time.</li>
        <li><strong className="text-foreground">Delete:</strong> You can request account deletion by contacting the admin team. This will remove your profile, hustles, and associated data.</li>
        <li><strong className="text-foreground">Opt-out:</strong> You can delete conversations and messages for yourself at any time.</li>
      </ul>
    </Section>

    <Section icon={Zap} title="Cookies & Local Storage">
      <p>
        HustleHive uses browser local storage (not traditional cookies) to maintain your login session and remember your theme preference (light/dark mode).
      </p>
      <ul className="list-disc list-inside space-y-1.5 mt-2">
        <li><strong className="text-foreground">hh_token:</strong> Your authentication token. Cleared on logout.</li>
        <li><strong className="text-foreground">hh_user:</strong> Your basic profile information for instant display. Cleared on logout.</li>
        <li><strong className="text-foreground">hh_theme:</strong> Your light/dark mode preference.</li>
        <li><strong className="text-foreground">hh_login_at:</strong> Timestamp of your last login for session expiry.</li>
      </ul>
      <p>All local storage data is cleared when you log out.</p>
    </Section>

    <Section icon={AlertTriangle} title="Changes to This Policy">
      <p>
        We may update this Privacy Policy from time to time as the platform evolves. Significant changes will be communicated to users through the platform. Your continued use of HustleHive after any changes constitutes your acceptance of the updated policy.
      </p>
      <p>
        If you have any questions about this Privacy Policy or how your data is handled, please contact the HustleHive admin team.
      </p>
    </Section>
  </div>
)

const Legal = () => {
  const [activeTab, setActiveTab] = useState('guidelines')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LANDING)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">HustleHive</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Legal & Community Standards
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Please read our community guidelines and privacy policy carefully. By using HustleHive, you agree to abide by these standards.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg mb-8 w-fit mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'guidelines' && <GuidelinesTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HustleHive. Built for college hustlers.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Legal