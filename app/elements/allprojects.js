"use client";
import { useEffect, useState, useContext, useMemo } from "react";
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


export default function ProjectList({ projects }) {
  const imageDt = process.env.NEXT_PUBLIC_NODE_API_URL + "/static";
     const getRandomDarkGradient = () => {
                const darkColors = [
                  '#0f2027', '#2c5364', '#1c1c1c', '#232526', '#414345',
                  '#000000', '#434343', '#141E30', '#000428', '#373737',
                ];
              
                const color1 = darkColors[Math.floor(Math.random() * darkColors.length)];
                const color2 = darkColors[Math.floor(Math.random() * darkColors.length)];
                return `linear-gradient(135deg, ${color1}, ${color2})`;
              };
              
              // Store it in a variable so it's consistent across renders
             

  return (
    <div className="w-full flex py-[20px] flex-col items-center justify-center">
   
      <ul className="flex flex-wrap w-full">
  {projects.length > 0 ? (
    projects.map((project) => (
      <li key={project._id} className="w-1/4 p-2 box-border">
        <Card style={{ background: getRandomDarkGradient(), color: '#ffffff' }}>
          <CardHeader>
            <CardTitle>{project.projectName}</CardTitle>
            <CardDescription className="text-white">{project.domain}</CardDescription>
          </CardHeader>
          <CardContent>
            {project.imageURL && (
              <Image
                src={imageDt + project.imageURL.toLowerCase()}
                className="object-cover w-full !h-[80px]"
                alt="Project Image"
                width={300}
                height={200}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm">
              <strong>By:</strong> {project?.createdBy?.username}
            </p>
            <Link
              className="bg-white rounded-lg px-4 text-sm text-black py-2"
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

     
      <br />
    </div>
  );
}
