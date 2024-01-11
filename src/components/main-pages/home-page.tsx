import { useEffect, useState } from "react";
import HomePageAllPost from "../home-page-components/home-all-post";
import HomeNavbar from "../home-page-components/home-navbar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const cookies = document.cookie;

    if (cookies.includes("accessToken")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      navigate("/login");

      toast({
        variant: "destructive",
        description: "Uh oh! Unauthorized request.",
      });
    }
  }, []);

  return (
    <>
      {isLogin && (
        <>
          <HomeNavbar />
          <HomePageAllPost />
        </>
      )}
    </>
  );
};

export default HomePage;
