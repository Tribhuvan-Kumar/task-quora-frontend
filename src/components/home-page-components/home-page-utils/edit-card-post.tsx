import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EachcardProps {
  setIsEditCardOpen: (isOpen: boolean) => void;
  onPostAdded: (
    posts: {
      _id: number;
      title: string;
      description: string;
      updatedAt: string;
    }[]
  ) => void;
  singlePost: {
    _id: number;
    title: string;
    description: string;
    isCompleted: boolean;
  };
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

const HomeEditCardDiv = ({
  setIsEditCardOpen,
  onPostAdded,
  singlePost,
}: EachcardProps) => {
  const { toast } = useToast();
  const { _id, title, description, isCompleted } = singlePost;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: title,
      description: description,
      isCompleted: isCompleted,
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
      const newData: {
        title: string;
        description: string;
        isCompleted: boolean;
        _id: number;
      } = { ...data, _id: _id, isCompleted: data.isCompleted || false };

      const response = await axios.put(
        "http://localhost:8000/api/v1/post/update-post",
        newData,
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
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Uh oh! Unable to submit. Please try again later!`,
      });
    } finally {
      setIsEditCardOpen(false);

      form.reset({
        title: "",
        description: "",
        isCompleted: false,
      });
    }
  }

  return (
    <>
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-72 sm:w-fit md:w-[40rem] z-50">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-5 sm:gap-20">
              <div className="text-lg sm:text-2xl">Create a New Post</div>
              <div>
                <X
                  className="cursor-pointer"
                  onClick={() => setIsEditCardOpen(false)}
                />
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
                          <Input placeholder="Enter a title ..." {...field} />
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
                    Update
                  </Button>
                </form>
              </Form>
            </div>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default HomeEditCardDiv;
