"use client"

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/actions/user/signupAction";

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
    <div className=" w-full mx-5 my-10 h-[calc(100vh-4rem)] grid place-items-center ">
      <Card className="md:w-[550px] px-3 py-1">
        <CardHeader>
          <CardTitle className="text-3xl">Hello</CardTitle>
          <CardDescription className="text-lg">Create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-4">
              <div onClick={handleGoogle} className="flex justify-start items-center px-3 py-2 cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-100 dark:text-black dark:hover:bg-slate-300 rounded-xl" >
                <FcGoogle size="27" />
                <span className="w-full text-center">Continue with Google</span>
              </div>
              <div onClick={handleGithub} className="flex justify-start items-center px-3 py-2 cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-100 dark:text-black dark:hover:bg-slate-300 rounded-xl">
                <SiGithub size="27" />
                <span className="w-full text-center">Continue with Github</span>
              </div>
            </div>
            <div className="relative flex items-center my-1">
              <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-gray-500 text-sm dark:bg-background">or</span>
              <Separator orientation="horizontal" className="w-full h-[1px] bg-gray-300 dark:bg-gray-200" />
            </div>
            <div>
              <label htmlFor="name" className="leading-5">*Name</label>
              <input
                id="name"
                placeholder="Enter your name"
                className="w-full px-2 py-3 font-medium border-[1px] border-slate-700 rounded-lg"
                type="text"
                {...register("name", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="email" className="leading-5">*Email</label>
              <input
                id="email"
                placeholder="Enter your email"
                className="w-full px-2 py-3 font-medium border-[1px] border-slate-700 rounded-lg"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="password" className="leading-5">*Password</label>
              <input
                id="password"
                className="w-full px-2 py-3 font-medium border-[1px] border-slate-700 rounded-lg"
                type="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 5,
                    message: "Password must be atleast 6 charactes long"
                  },
                  maxLength: {
                    value: 15,
                    message: "Password cannot exceed 14 characters"
                  },
                })}
              />
            </div>
            <div className="w-full py-2 text-lg font-semibold rounded-xl text-center bg-slate-200 hover:bg-slate-300 hover:cursor-pointer dark:bg-slate-100 dark:text-black dark:hover:bg-slate-300 ">
              <button type="submit">Sign Up</button>
            </div>
          </CardContent>
        </form>
        <CardFooter>
          <div>
            Already have an account? <Link className="text-blue-500 underline" href="/auth/sign-up">Sign In</Link>
          </div>
        </CardFooter>
      </Card>
    </div >
  </>
  );
}