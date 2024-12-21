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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email"  {...register("email")} />
      <input type="password" {...register("password", { required: true })} />
      {errors.password && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}