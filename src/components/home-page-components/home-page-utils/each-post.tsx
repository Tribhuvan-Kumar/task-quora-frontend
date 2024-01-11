import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface EachPostDivProps {
  singlePost: {
    _id: number;
    title: string;
    description: string;
    updatedAt: string;
  };
  onPostAdded: (
    posts: {
      _id: number;
      title: string;
      description: string;
      updatedAt: string;
    }[]
  ) => void;
}

const EachPostDiv = ({ singlePost, onPostAdded }: EachPostDivProps) => {
  const { _id, title, description, updatedAt } = singlePost;
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const newDescription = description.substring(0, 25);
  const phoneScreenTitle =
    title.length > 20 ? title.substring(0, 20) + "..." : title;
  const bigScreenTitle =
    title.length > 30 ? title.substring(0, 30) + "..." : title;

  useEffect(() => {
    const updateDate = new Date(updatedAt);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - updateDate.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (minutesDifference < 60) {
      setTimeAgo(`${minutesDifference} minutes ago`);
    } else {
      setTimeAgo(`${hoursDifference} hours ago`);
    }
  }, []);

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  async function handleDeletePost() {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/post/delete-post",
        {
          data: { _id },
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
        description: "Uh oh! Network error. Please try again later!",
      });
    }
  }

  return (
    <>
      <Card className="w-80 h-36 sm:w-96">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="block sm:hidden">
              {phoneScreenTitle}
            </CardTitle>
            <CardTitle className="hidden sm:block">{bigScreenTitle}</CardTitle>
            <div onClick={handleMenuOpen} className="relative">
              <MoreVertical className="cursor-pointer" />
              {isMenuOpen && (
                <div className="absolute right-0 px-5 py-3 flex flex-col items-start gap-2 border rounded-lg bg-white dark:bg-black">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("edit");
                    }}
                  >
                    Edit
                  </p>
                  <Separator />
                  <p className="cursor-pointer" onClick={handleDeletePost}>
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
          <Separator className="mb-2" />
          <div className="flex flex-col items-start gap-8">
            <p>{newDescription} ...</p>
            <p className="text-[10px]">{timeAgo}</p>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default EachPostDiv;
