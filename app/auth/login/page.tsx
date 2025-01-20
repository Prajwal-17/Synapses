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
} from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string,
  password: string,
};

export default function Login() {

  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    async function login() {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      router.push("/home")
      return response;
    }

    toast.promise(
      login(),
      {
        richColors: true,
        loading: "Logging in...",
        success: "You are logged in successfully",
        error: (error) => {
          return error.message || "An unknown error occurred";
        },
      }
    );
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
          <CardTitle className="text-3xl">Hi, Welcome Back</CardTitle>
          <CardDescription className="text-lg">Log In to your account</CardDescription>
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
              <label htmlFor="email" className="leading-10">*Email</label>
              <input
                id="email"
                placeholder="Enter your email"
                className="w-full px-2 py-3 font-medium border-[1px] border-slate-700 rounded-lg"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="password">*Password</label>
              <input
                id="password"
                className="w-full px-2 py-3 font-medium border-[1px] border-slate-700 rounded-lg"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
            <div className="w-full py-2 text-lg font-semibold rounded-xl text-center bg-slate-200 hover:bg-slate-300 hover:cursor-pointer dark:bg-slate-100 dark:text-black dark:hover:bg-slate-300 ">
              <button type="submit">Log In</button>
            </div>
          </CardContent>
        </form>
        <CardFooter>
          <div>
            Don &apos; t have an account? <Link className="text-blue-500 underline" href="/auth/sign-up">Sign Up</Link>
          </div>
        </CardFooter>
      </Card>
    </div >
  </>
  );
}