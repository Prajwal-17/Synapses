"use server"

import { SignUpInputs } from "@/app/auth/sign-up/page"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export const signUpAction = async (formData: SignUpInputs) => {

  try {

    if (!formData.name || !formData.email || !formData.password) {
      return { message: "All fields are required", success: false }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: formData.email,
      }
    });

    if (existingUser) {
      return { message: "User already exists", success: false }
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10)

    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
      }
    })

    if (user) {
      return { message: "User created successfully", success: true }
    }

    return { message: "Failed to create a user", success: false }

  } catch (error) {
    console.log(error)
    return { message: 'Something went wrong', success: false }
  }
} 