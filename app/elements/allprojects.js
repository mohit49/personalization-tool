"use client";
import { useEffect, useState, useContext } from "react";
import { getProjects } from "@/app/api/api";
import { AppContext } from "@/app/context/provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader"; // Importing ClipLoader

export default function ProjectList() {
  const { setProjects, projects } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getProjects();
      if (result.length > 0) {
        setProjects(result);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-4">
        {/* Displaying the ClipLoader while loading */}
        <ClipLoader size={50} color="#000000" />
      </div>
    );
  }

  const imageDt = process.env.NEXT_PUBLIC_NODE_API_URL;

  return (
    <div className="mt-4">
      <div className="flex flex-row flex-wrap gap-4 mt-4 mb-4 p-4">
        <ul className="flex flex-row flex-wrap gap-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project._id} className="w-[300px]">
                <Card>
                  <CardHeader>
                    <CardTitle>{project.projectName}</CardTitle>
                    <CardDescription>{project.domain}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={imageDt + project.imageURL}
                      className="object-cover w-[100%] !h-[80px]"
                      alt="Project Image"
                      width={300}
                      height={200}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between align-middle items-center">
                    <p className="text-[15px]">
                      <strong> By: </strong>
                      {project?.createdBy?.username}
                    </p>
                    <Link
                      className="bg-[#000000] rounded-lg px-[15px] text-[14px] flex flex-row text-[#ffffff] py-[8px]"
                      href={`/dashboard/${project._id}`}
                    >
                      Create Activity
                    </Link>
                  </CardFooter>
                </Card>
              </li>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </ul>
      </div>
      <br />
    </div>
  );
}
