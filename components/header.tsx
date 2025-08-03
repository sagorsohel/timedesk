"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/lib/useCurrentUser"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,

  DropdownMenuSeparator,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClerk } from "@clerk/nextjs";



export function Header() {
  const { user, isSignedIn, isLoaded } = useCurrentUser(); // Always here
  const { signOut } = useClerk();
  if (!isLoaded) return null;
  

  // handle login navigation
  const router = useRouter()
  const handleLogin = () => {
    router.push("/sign-in")
  }
  
  // handle log out

  

  const handleLogOut = () => {
    signOut();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TimeDesk</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            {
              !isSignedIn && <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
            }
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='start'
                  className='data-[state=closed]:slide-out-to-left-20 data-[state=open]:slide-in-from-left-20 top-3 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 w-56 duration-400'
                >

                  <DropdownMenuGroup>
                    <Link href="/admin/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogOut}>Log out</DropdownMenuItem>
                   
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>


            ) : (
              <Button onClick={handleLogin}>Get Started</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
