'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { signUpAction } from "@/actions/signUpAction"
import { useRouter } from "next/navigation"

export function SingInFrom({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
    const router = useRouter()
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [state, action, isPending] = useActionState(signUpAction, undefined);

    //    check password match
    const passwordMatch = confirmPassword && password === confirmPassword;

    // Navigate when success changes
    useEffect(() => {
        if (state?.success) {
            const timeout = setTimeout(() => {
                router.push("/sign-in");
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [state?.success, router]);


    return (
        <form action={action} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign In to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to Sign In to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" id="name" type="text" placeholder="sohel hossain" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" id="email" type="email" placeholder="sohel@example.com" required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>

                    </div>
                    <Input onChange={(e) => setPassword(e.target.value)}
                        name="password" id="password" type="password" required />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>

                    </div>
                    <Input onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirmPassword" id="confirmPassword" type="password" required />
                </div>
                {confirmPassword && !passwordMatch && (
                    <p style={{ color: "red" }}>Passwords do not match</p>
                )}
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
                Already have an account?{" "}
                <Link href="/sign-in" className="underline text-primary underline-offset-4">
                    Sign In
                </Link>
            </div>
        </form>
    )
}
