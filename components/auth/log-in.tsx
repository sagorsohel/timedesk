'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { loginAction } from "@/actions/loginAction"

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {


  const [state, action, isPending] = useActionState(loginAction, undefined);

  if (state?.token) {
    localStorage.setItem("token", state.token); // ✅ Runs in browser
    localStorage.setItem("user", JSON.stringify(state.user));
  }

  console.log(state?.user)

 

  return (
    <form action={action} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Log In to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to Log In to your account
        </p>
      </div>
      <div className="grid gap-6">
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
            {state.message}
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
