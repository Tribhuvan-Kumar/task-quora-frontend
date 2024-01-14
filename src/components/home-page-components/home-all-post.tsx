import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import AddNewPost from "./home-page-utils/add-new-post";
import EachPostDiv from "./home-page-utils/each-post";

interface PostDesign {
  _id: number;
  title: string;
  description: string;
  updatedAt: string;
  isCompleted: boolean;
}

const HomePageAllPost = () => {
  const [isPost, setIsPost] = useState<boolean>(false);
  const [allPost, setAllPost] = useState<PostDesign[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    async function getPostOnRefresh() {
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

        setAllPost(response.data.data);
        setIsPost(true);
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
            <div className="px-16 mt-20 flex flex-col items-center justify-center gap-28 sm:gap-20 sm:flex-row sm:items-start sm:justify-start">
              <div>
                <AddNewPost onPostAdded={setAllPost} />
              </div>
              <div className="grow grid place-items-center gap-20 lg:place-items-start lg:grid-cols-2 xl:grid-cols-3">
                {allPost.map((singlePost) => (
                  <EachPostDiv
                    key={singlePost._id}
                    singlePost={singlePost}
                    onPostAdded={setAllPost}
                  />
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
