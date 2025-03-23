"use client"

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@repo/ui"
import { Separator } from "@repo/ui";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/actions/user/signupAction";
import { motion } from "motion/react"

export type SignUpInputs = {
  email: string,
  password: string,
  name: string,
};

export default function SignUp() {

  const router = useRouter();
  const { register, handleSubmit } = useForm<SignUpInputs>();

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {

    async function signUp() {

      const response = await signUpAction(data);

      if (!response.success) {
        throw new Error(response.message)
      }

      router.push("/home")
      return response.message
    }

    toast.promise(
      signUp(), {
      loading: "Signing up...",
      success: (data) => {
        return data
      },
      error: (error) => {
        return error.message
      }
    }
    )
  };

  const handleGoogle = async () => {
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/home"
      })

    } catch (error) {
      console.log(error)
    }
  }

  const handleGithub = async () => {
    try {
      await signIn("github", {
        redirect: true,
        callbackUrl: "/home"
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <div className="h-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="flex flex-col justify-center items-center py-8 mx-5 w-full"
      >
        <Card className="w-full max-w-md bg-background shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Welcome back</CardTitle>
            <CardDescription className="text-md text-center text-slate-500">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-md">Username</Label>
                <Input
                  id="name"
                  placeholder="JohnDoe"
                  className="py-3 rounded-lg"
                  type="text"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-md">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="py-3 rounded-lg"
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-md">Password</Label>
                  <Link href="/" className="hover:underline text-sm">
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  className="py-3 rounded-lg"
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>
              <Button type="submit" className="w-full ">
                Sign up
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex items-center w-full gap-2">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-colors"
                onClick={handleGoogle}
              >
                <FcGoogle size="27" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-colors"
                onClick={handleGithub}
              >
                <SiGithub size="27" />
                Github
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  </>
  );
}