'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { loginAction } from "@/actions/loginAction"
import { useRouter } from "next/navigation"

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter()

  const [state, action, isPending] = useActionState(loginAction, undefined);

  if (state?.token) {
    localStorage.setItem("token", state.token); // ✅ Runs in browser
    localStorage.setItem("user", JSON.stringify(state.user));
  }

  console.log(state?.user)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/dashboard");
    }
  }, [state?.success]);



  return (
    <form action={action} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Log In to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to Log In to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582
      0-.287-.01-1.046-.016-2.054-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.334-1.754-1.334-1.754
      -1.09-.744.082-.729.082-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.304 3.492.997
      .108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.333-5.466-5.931
      0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 6.844
      c1.02.005 2.045.138 3.004.404 2.29-1.552 3.296-1.23 3.296-1.23
      .655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221
      0 4.61-2.805 5.625-5.476 5.921.43.37.823 1.103.823 2.222
      0 1.604-.015 2.897-.015 3.293 0 .322.217.699.825.58C20.565 21.796 24 17.297 24 12
      c0-6.63-5.37-12-12-12z"
              clipRule="evenodd"
            />
          </svg>
          Login with GitHub
        </Button>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" placeholder="sohel@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>

          </div>
          <Input name="password" id="password" type="password" required />
        </div>

        {state?.message && (
          <p className={`text-sm ${state.success ? "text-green-500" : "text-red-500"}`}>
            {state.message} {
              state?.success && 'Navigating Dashboard...'
            }
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>


      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline text-primary underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
