import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AddNewPostProps {
  onPostAdded: (
    posts: {
      _id: number;
      title: string;
      description: string;
      updatedAt: string;
      isCompleted: boolean;
    }[]
  ) => void;
}

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  isCompleted: z.boolean().default(false).optional(),
});

const AddNewPost: React.FC<AddNewPostProps> = ({ onPostAdded }) => {
  const [newPostDivOpen, setNewPostDivOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      isCompleted: false,
    },
  });

  async function getAllPost() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/post/get-user-posts",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onPostAdded(response.data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Uh oh! Network error. Please try again later!",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/post/add-post",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        toast({
          description: response.data.message,
        });
        getAllPost();
      }, 0);

      setNewPostDivOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Uh oh! Unable to submit. Please try again later!`,
      });
    } finally {
      form.reset({
        title: "",
        description: "",
        isCompleted: false,
      });
    }
  }

  function handleOpen() {
    setNewPostDivOpen(!newPostDivOpen);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 sm:inline-block">
        <Button onClick={handleOpen}>Add new post</Button>
        {newPostDivOpen && (
          <div className="sm:absolute">
            <Card className="relative sm:left-40 sm:bottom-10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-5 sm:gap-20">
                  <div className="text-lg sm:text-2xl">Create a New Post</div>
                  <div>
                    <X className="cursor-pointer" onClick={handleOpen} />
                  </div>
                </CardTitle>
                <Separator />
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-5"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a title ..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a description ..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isCompleted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Mark as completed.</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="mt-4" type="submit">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewPost;
