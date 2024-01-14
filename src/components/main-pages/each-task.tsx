import axios from "axios";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RetrievedDataObject {
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const EachTaskPage = () => {
  const [retrievedData, setRetrievedData] = useState<RetrievedDataObject>();
  const [gettingData, setGettingData] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getEachTask = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/post/each-post",
          {
            params: { id: params.id },
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setRetrievedData(response.data.data);
        setGettingData(false);
      } catch (error) {
        setGettingData(true);
      }
    };

    getEachTask();
  }, []);

  //   setting created at date
  const dateObject = retrievedData?.createdAt
    ? new Date(retrievedData.createdAt)
    : null;
  const year = dateObject?.getFullYear();
  const month =
    dateObject?.getMonth() !== undefined
      ? dateObject.getMonth() + 1
      : undefined;
  const day = dateObject?.getDate();

  const handleRedirectHome = () => {
    navigate("/");
  };

  return (
    <>
      {gettingData ? (
        <div>each task</div>
      ) : (
        <div className="flex flex-col px-7 mt-10 gap-10">
          <div
            className="flex items-center justify-start gap-1"
            onClick={handleRedirectHome}
          >
            <Home className="w-5 cursor-pointer" onClick={handleRedirectHome} />
            <p className="cursor-pointer" onClick={handleRedirectHome}>
              Home
            </p>
          </div>
          <div className="mx-0 sm:mx-40">
            <Card>
              <CardHeader>
                <CardTitle>{retrievedData?.title}</CardTitle>
                <CardDescription>{retrievedData?.description}</CardDescription>
              </CardHeader>
              <div className="flex items-center justify-around gap-0 mb-5 ms-0 sm:justify-start sm:gap-10 sm:ms-5">
                <div>
                  {retrievedData?.isCompleted ? (
                    <Badge>Completed</Badge>
                  ) : (
                    <Badge>Pending</Badge>
                  )}
                </div>
                <div>
                  <p>Created on: {`${day}/${month}/${year}`}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default EachTaskPage;
