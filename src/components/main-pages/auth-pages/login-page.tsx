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

import LoginImage from "@/assets/login.jpg";
import { useEffect, useState } from "react";

const FormSchema = z.object({
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

const LoginPage = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (document.cookie.includes("newaccessToken")) {
      setIsUserLoggedIn(true);

      setTimeout(() => {
        toast({
          description: "You are already logged in!",
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
      email: "",
      password: "",
    },
  });

  // const regenerateTokens = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/v1/user/refresh-token",
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast({
        description: response.data.message,
      });
      navigate("/");
    } catch (error) {
      // regenerateTokens();
      toast({
        variant: "destructive",
        description: "Uh oh! Unable to login. Please try again later!",
      });
    }
  };

  return (
    <>
      {!isUserLoggedIn && (
        <div className="flex items-center justify-evenly h-screen">
          <img
            src={LoginImage}
            className="hidden lg:block lg:w-4/12 rounded-3xl"
            alt=" "
          />
          <div className="-mt-40 lg:mt-0">
            <p className="font-extrabold text-3xl text-center">Login!</p>
            <Separator className="my-5" />

            <div className="w-72 sm:w-96">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-3"
                >
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
                          <Input placeholder="Confirm a password" {...field} />
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
                  Don't have an account?{" "}
                  <Link to="/signup" className="ms-3 font-medium text-blue-700">
                    Signup now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
