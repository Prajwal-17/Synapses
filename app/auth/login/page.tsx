"use client"

import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string,
  password: string,
};

export default function Login() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })


      if (response?.ok) {
        console.log("success")
      } else {
        console.log("failed")
      }


    } catch (error) {
      console.log(error)
    }

  }

  const handleGoogle = async () => {
    try {
      const value = await signIn("google")

      if (value?.error) {
        console.log("google success")
      } else {
        console.log("failed")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email"  {...register("email")} />
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}
        <input type="submit" />
      </form>

      <button onClick={handleGoogle}>Google</button>
    </div>
  );
}