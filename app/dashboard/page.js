"use client";
import { PanelsTopLeft } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/include/header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addProject, getProjects } from "../api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ProjectList from "@/app/elements/allprojects";
import { AppContext } from "@/app/context/provider";
import ClipLoader from "react-spinners/ClipLoader"; // Import the ClipLoader

// ✅ Define validation schema using Zod
const formSchema = z.object({
  domain: z
    .string()
    .min(5, { message: "Domain name must be at least 5 characters." })
    .max(253, { message: "Domain name is too long." })
    .regex(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, {
      message: "Invalid domain format (e.g., example.com).",
    }),
  projectname: z
    .string()
    .min(4, { message: "Project name must be at least 4 characters." })
    .max(253, { message: "Project name is too long." }),
  image: z.instanceof(File).optional(),
});

export default function Dashboard() {
  const { projects, setProjects } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      projectname: "",
      image: null,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // ✅ Check if file is an image
    if (!file.type.startsWith("image/")) {
      form.setError("image", { message: "Please select a valid image file." });
      return;
    }

    // ✅ Check if file size is within limit (200KB)
    if (file.size > 204800) {
      form.setError("image", { message: "File size should not exceed 200KB." });
      return;
    }

    // ✅ Set image preview and form value
    setPreviewImage(URL.createObjectURL(file));
    form.setValue("image", file);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const result = await addProject(data);

    if (result.success) {
      form.reset();
      setPreviewImage(null);
      setOpen(false);
      setProjects((prevProjects) => [...prevProjects, result?.data?.project]);
    } else {
      // Replace alert with form error messages
      form.setError("domain", { message: result.message });
    }

    setIsLoading(false);
  };

  useEffect(() => {
      async function fetchData() {
        const result = await getProjects();
        if (result.length > 0) {
          setProjects(result);
        }
        setLoading(false);
      }
      fetchData();
    }, [projects]);

    if (loading) {
      return (
        <div className="flex justify-center items-center my-4">
          {/* Displaying the ClipLoader while loading */}
          <ClipLoader size={50} color="#000000" />
        </div>
      );
    }
  return (
    <>
      <Header />
      <section className="w-full min-h-[700px] flex flex-col bg-[#f5f5f5] items-center justify-center pt-[50px] pb-[50px]">
        {!projects ? (
          <h1 className="text-3xl mb-[20px]">
            You haven't added any website. Please add a website to get started.
          </h1>
        ) : (
          <h1 className="text-3xl mb-[20px] font-bold">Your Projects</h1>
        )}
        {projects && 
        <div className="flex flex-col justify-between items-center w-full px-[20px] container">
          <ProjectList projects={projects} />
        </div>}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-[#6a45f9] rounded-lg px-[30px] flex flex-row text-[#ffffff] py-[10px]" size="lg">
            <PanelsTopLeft /> &nbsp; Add Project
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Website URL" {...field} className="h-[45px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Project Name" {...field} className="h-[45px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* ✅ Image Upload Field */}
                    <FormItem>
                      <FormLabel>Upload Image (Max: 200KB)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="h-[45px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    {/* ✅ Image Preview */}
                    {previewImage && (
                      <div className="mt-2">
                        <img src={previewImage} alt="Preview" className="w-[200px] h-auto rounded-md shadow" />
                      </div>
                    )}

                    <Button type="submit" className="bg-[#6a45f9]" disabled={isLoading}>
                      {isLoading ? (
                        <ClipLoader color="white" size={24} />
                      ) : (
                        "Add Project"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
