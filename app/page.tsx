import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  StickyNote,
  History,
  FolderKanban,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
} from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
    

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Your Digital Workspace
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  TimeDesk
                  <span className="block text-primary">All Your Work Essentials</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  The ultimate digital desk that combines time tracking, scheduling, notes, browsing history, and
                  project management in one beautiful, intuitive workspace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Free 14-day trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  No credit card required
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl" />
              <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=TimeDesk+Dashboard+Preview"
                  alt="TimeDesk Dashboard"
                  width={600}
                  height={400}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Star className="w-3 h-3 mr-1" />
              Core Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              TimeDesk brings together all your essential work tools in one seamless, intelligent workspace designed for
              modern professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Time Tracking</CardTitle>
                <CardDescription>
                  Automatically track time across projects with intelligent categorization and detailed analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Automatic time detection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Project categorization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Detailed reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Intelligent Scheduling</CardTitle>
                <CardDescription>
                  AI-powered calendar that learns your patterns and suggests optimal meeting times.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Smart scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Calendar integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Meeting optimization
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <StickyNote className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Notes</CardTitle>
                <CardDescription>
                  Capture, organize, and search through your thoughts with AI-powered note-taking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Rich text editor
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Smart search
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Auto-tagging
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Browsing History</CardTitle>
                <CardDescription>
                  Track and organize your research with intelligent browsing history management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Smart categorization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Research tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Quick retrieval
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Project Management</CardTitle>
                <CardDescription>
                  Manage projects with Kanban boards, Gantt charts, and team collaboration tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Kanban boards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Privacy & Security</CardTitle>
                <CardDescription>
                  Enterprise-grade security with end-to-end encryption and privacy controls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Privacy controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    GDPR compliant
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">Hours Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Ready to transform your workspace?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of professionals who have already made TimeDesk their digital headquarters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  )
}
