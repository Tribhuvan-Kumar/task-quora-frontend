import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Card, CardTitle } from "@/components/ui/card";
import { BookOpen, Home } from "lucide-react";

interface UserData {
  email: string;
  fullName: string;
  updatedAt: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>();
  const navigate = useNavigate();
  const { toast } = useToast();

  function getDate(fullDate: string) {
    const updateDate = new Date(fullDate);

    const year = updateDate.getFullYear();
    const month = updateDate.getMonth() + 1;
    const date = updateDate.getDate();

    return `${date}/${month}/${year}`;
  }

  useEffect(() => {
    async function getUserDetail() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/user/current-user",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setUser(response.data.data);
        setIsUserLoggedIn(true);
      } catch (error) {
        toast({
          description: "Uh oh! Unauthorized request. Please try again later!",
        });

        setIsUserLoggedIn(false);
        navigate("/login");
      }
    }

    getUserDetail();
  }, []);

  const userLastUpdatedProfileOn = getDate(user?.updatedAt || "");
  const userMemberSince = getDate(user?.createdAt || "");

  return (
    <>
      {isUserLoggedIn && user && (
        <div className="px-6 pt-10 flex flex-col items-start">
          <Link to="/" className="flex gap-2">
            <Home />
            <p>Home</p>
          </Link>
          <div className="flex flex-col items-start gap-10 mt-10 w-full sm:mt-20 sm:flex-row">
            <div className="flex items-center gap-2">
              <BookOpen />
              <CardTitle>Overview</CardTitle>
            </div>
            <Card className="w-80 flex flex-col">
              <div className="flex gap-20 mx-auto">
                <p>Full Name:</p>
                <p>{user.fullName}</p>
              </div>
              <div className="flex gap-20 mx-auto">
                <p>Email ID:</p>
                <p>{user.email}</p>
              </div>
              <div className="flex gap-20 mx-auto">
                <p>Updated On:</p>
                <p>{userLastUpdatedProfileOn}</p>
              </div>
              <div className="flex gap-20 mx-auto">
                <p>Member Since:</p>
                <p>{userMemberSince}</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
