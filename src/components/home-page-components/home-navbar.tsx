import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const HomeNavbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserLogOut = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setTimeout(() => {
        toast({
          description: response.data.message,
        });
      }, 0);

      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Uh oh! Unable to logout. Please try again later!",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-5 sm:px-16">
        <div>
          <Link to="/">
            <p className="font-bold text-2xl cursor-pointer">
              Task<span className="text-red-600">Quora</span>
            </p>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUserLogOut}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default HomeNavbar;
