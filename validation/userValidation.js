import {z} from "zod";

export const UserRegister = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.email("Invalid Email Address"),
  password: z.string().min(6, "Please Enter Minimum 6 alphabet Long Password"),
});

export const UserLogin = z.object({
  email: z.email("Invalid Email Address"),
  password: z.string().min(6, "Please Enter Minimum 6 alphabet Long Password"),
});
