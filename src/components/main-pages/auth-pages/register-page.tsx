import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import SignUpImage from "@/assets/signup.jpg";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Your name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .refine(
      (value) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(value),
      {
        message:
          "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.",
      }
    ),
});

const RegisterPage = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (document.cookie.includes("accessToken")) {
      setIsUserLoggedIn(true);

      setTimeout(() => {
        toast({
          description: "You've already registered!",
        });
      }, 0);
      navigate("/");
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/login");

      toast({
        description: response.data.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Uh oh! Unable to Signup. Please try again later!`,
      });
    }
  };

  return (
    <>
      {!isUserLoggedIn && (
        <div className="flex items-center justify-evenly h-screen">
          <div className="-mt-20 lg:mt-0">
            <p className="font-extrabold text-3xl text-center">Sign Up!</p>
            <Separator className="my-5" />

            <div className="w-72 sm:w-96">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter you name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-5">
                    Submit
                  </Button>
                </form>
              </Form>

              <div className="flex items-center justify-center">
                <Separator className="my-10 w-20 sm:w-48" />
                <p className="mx-5">OR</p>
                <Separator className="my-10 w-20 sm:w-48" />
              </div>

              <div>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="ms-3 font-medium text-blue-700">
                    Login now
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <img
            src={SignUpImage}
            className="hidden lg:block lg:w-4/12 rounded-3xl"
            alt=" "
          />
        </div>
      )}
    </>
  );
};

export default RegisterPage;
