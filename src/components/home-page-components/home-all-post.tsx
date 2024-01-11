import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface PostDesign {
  _id: number;
  title: string;
  description: string;
}

const HomePageAllPost = () => {
  const [isPost, setIsPost] = useState<boolean>(false);
  const [allPost, setAllPost] = useState<PostDesign[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    async function getPostOnRefresh() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/post/get-user-posts"
        );
        setAllPost(response.data.data);
        setIsPost(true);
        toast({
          description: "Every is upto date!",
        });
      } catch (error) {
        setIsPost(false);
        toast({
          variant: "destructive",
          description: "Uh oh! Network error. Please try again later!",
        });
      }
    }

    getPostOnRefresh();
  }, []);

  return (
    <>
      <div>
        {isPost ? (
          <>
            <div className="px-16 mt-20 flex items-start justify-start gap-20">
              <div>
                <Button>Add New Post</Button>
              </div>
              <div className="grow grid grid-cols-3 place-items-center gap-20">
                {allPost.map((singlePost) => (
                  <div key={singlePost._id}>
                    <p>{singlePost.title}</p>
                    <p>{singlePost.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="px-16 mt-20 flex items-start justify-start gap-20">
              <div className="">
                <Button>Add New Post</Button>
              </div>
              <div className="grow grid grid-cols-3 place-items-center gap-20">
                <div className="flex flex-col items-start justify-center bg-yellow-50 py-4 px-5 h-36 rounded-xl">
                  <p className="font-semibold text-xl">No Post</p>
                  <Separator className="mb-2" />
                  <p>No Post</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePageAllPost;
