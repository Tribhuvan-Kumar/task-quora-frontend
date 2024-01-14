import { useEffect, useState } from "react";
import HomePageAllPost from "../home-page-components/home-all-post";
import HomeNavbar from "../home-page-components/home-navbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie;

    if (cookies.includes("refreshToken")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      navigate("/login");
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
