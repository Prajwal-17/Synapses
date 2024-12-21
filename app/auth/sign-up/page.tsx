"use client"

import { signUpAction } from "@/actions/user/signupAction";
import { useForm, SubmitHandler } from "react-hook-form";

export type signUpInputs = {
  username: string,
  password: string,
  email: string,
};

export default function SignUp() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<signUpInputs>();

  const onSubmit: SubmitHandler<signUpInputs> = async (data: signUpInputs) => {

    try {
      const value = await signUpAction(data);

      if (value.success) {
        console.log("successfull")
      } else {
        console.log("failed")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (<>
    <form className="text-black bg-white" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Name"
        {...register("username", { required: true })}
      />
      {errors.username && <span>This field is required</span>}
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <span>This field is required</span>}
      <input
        type="password"
        placeholder="Password"
        {...register("password",
          {
            required: true,
            minLength: {
              value: 5,
              message: "Password must be atleast 6 charactes long"
            },
            maxLength: {
              value: 15,
              message: "Password cannot exceed 14 characters"
            },

          }
        )}
      />
      {errors.password && <span>{errors.password.message}</span>}
      <input
        type="submit"
      />

    </form>
  </>)
}