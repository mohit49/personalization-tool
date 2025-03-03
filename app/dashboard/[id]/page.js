"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"; // Correct import for App Router
import Header from "@/include/header";
import { fetchProjectById, deleteProject, fetchActivitiesByProject } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { SearchCom } from "@/app/elements/search";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut , DropdownMenuLabel, DropdownMenuTrigger , DropdownMenuSeparator , DropdownMenuGroup  } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/app/elements/alert-dialog";
import { DataDialog } from "@/app/elements/dialog";
import { DelUserDialog } from "@/app/elements/delUserDialog";
import { CreateActivityDialog } from "@/app/elements/create-activity-dialog";
import {
  EllipsisVertical 
} from "lucide-react"
import ActivityCard from "@/app/elements/activity-card";
import  LaunchDialog  from "@/app/elements/launch-dialog";
const apiUrl = process.env.NEXT_PUBLIC_NODE_API_URL;
const imageDt = apiUrl;

export default function Dashboard() {
  const router = useRouter();
  const { id } = useParams(); // Extract 'id' from URL params
  const [project, setProject] = useState(null);
  const [activities, setActivities] = useState([]);

  const [activityDialog, setActivityDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLaunch, setOpenLaunch] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [delUser, setDelUserDialog] = useState(false);
  const [activityType, setActivityType] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id);
        setProject(data);
        if (data) {
          // Fetch activities when project data is available
          const activitiesData = await fetchActivitiesByProject(id);
          setActivities(activitiesData);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    if (id) loadProject();
  }, [id]);

  const handleDelete = async () => {
    const projectId = project._id;
    try {
      await deleteProject(projectId);
      router.push(`/dashboard/`);
    } catch (error) {
      alert("Error deleting project: " + (error.response?.data?.error || error.message));
    }
  };

  const handleActivitySelection = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId) // Deselect activity
        : [...prev, activityId] // Select activity
    );
  };

  // Memoize activities list to prevent unnecessary re-renders
  const memoizedActivities = useMemo(() => activities, [activities]);

  return (
    <>
      <Header />
      <section className="w-full min-h-[800px] flex flex-col bg-[#f5f5f5] items-start !justify-top pt-[10px] pb-[50px]">
      {project &&  <div className="w-full flex flex-row justify-between items-center py-[10px] px-0 container">
            <div className="logo">
            <div><img src={imageDt + project.imageURL} alt="Preview" className="w-[120px] h-auto " /></div>
            <h3 className="font-brand mt-[10px]">{project.projectName}</h3>
            <h5 className="mt-[10px] text-[13px] mt-0">{project.domain}</h5>
            </div>
            <div className="flex flex-row items-center space-x-4">
              <SearchCom placeholder="Search Your activity here"/>
              <Button className="!bg-[#c0392b]" onClick={(e)=>setOpenLaunch(true)}>Setup Engine</Button>
              <DropdownMenu>
      <DropdownMenuTrigger asChild>
   <Button >Create Activity</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Create Activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={(e) => {setActivityDialog(true), setActivityType("ab")} }>
           A/B Testing
           
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {setActivityDialog(true), setActivityType("xt")} }>
            XT Activity
           
          </DropdownMenuItem>
         
         
        </DropdownMenuGroup>
    
      </DropdownMenuContent>
    </DropdownMenu>
            <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{project.projectName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Update Project Details
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
         
         
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
    
        <DropdownMenuItem onClick={(e)=> setUserDialog(true)}>Users and Roles</DropdownMenuItem>
        <DropdownMenuItem onClick={(e)=> setDelUserDialog(true)}>Delete User</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
       
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => setOpen(true)}>
Remove Project
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <LaunchDialog open={openLaunch} setOpen={setOpenLaunch} projectId={project._id}/>
        
               <Dialog open={open} setOpen={setOpen}>
               <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
             You will have no more acces to this project and all activities will be deleted
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

               </Dialog>
               <DataDialog open={userDialog} setOpen={setUserDialog} projectId={project._id}/>
               <DelUserDialog open={delUser} setOpen={setDelUserDialog} projectId={project._id} usersList={project.users}/>
            </div>

        </div>}

        {/* Activity Creation Dialog */}
        <CreateActivityDialog
          open={activityDialog}
          projectId={project?._id}
          setOpen={setActivityDialog}
          activityType={activityType}
        />

        {/* Confirm Delete Project Dialog */}
        <Dialog open={open} setOpen={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will have no more access to this project, and all activities will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Dialog>

        <DataDialog open={userDialog} setOpen={setUserDialog} projectId={project?._id} />
        <DelUserDialog
          open={delUser}
          setOpen={setDelUserDialog}
          projectId={project?._id}
          usersList={project?.users}
        />

        {/* Filters */}
        <div className="w-full flex flex-row justify-between items-start py-[10px] px-0 container gap-2">
          <div className="w-1/6 px-[10px] py-[20px] bg-[#ffffff] rounded-lg">
            <h3 className="font-bold">By Activity Status</h3>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="live" />
              <label htmlFor="live" className="text-sm font-medium">Live</label>
            </div>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="archived" />
              <label htmlFor="archived" className="text-sm font-medium">Archived</label>
            </div>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="drafted" />
              <label htmlFor="drafted" className="text-sm font-medium">Drafted</label>
            </div>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="inactive" />
              <label htmlFor="inactive" className="text-sm font-medium">Inactive</label>
            </div>

            <Separator className="my-4" />

            <h3 className="font-bold">By Activity Type</h3>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="xt" />
              <label htmlFor="xt" className="text-sm font-medium">XT</label>
            </div>

            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="ab" />
              <label htmlFor="ab" className="text-sm font-medium">AB</label>
            </div>

            <Separator className="my-4" />

            <h3 className="font-bold">Build With</h3>
            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="vec" />
              <label htmlFor="vec" className="text-sm font-medium">VEC</label>
            </div>

            <div className="flex items-center space-x-2 py-[10px]">
              <Checkbox id="custom" />
              <label htmlFor="custom" className="text-sm font-medium">Custom Code</label>
            </div>
          </div>

          {/* Activity List */}
          <div className="w-full px-[10px] py-[20px] bg-[#ffffff] rounded-lg min-h-[600px]">
            {memoizedActivities && memoizedActivities.length === 0 && (
              <div className="text-center w-full self-center">
                <h2 className="font-brand font-thin text-[20px]">
                  You haven't created any activity, Please create activity.
                </h2>
              </div>
            )}

            {memoizedActivities && memoizedActivities.length > 0 && (
              <div className="w-full">
                <h2 className="font-bold text-xl mb-4">Activities</h2>

                <div

className="grid grid-cols-6 gap-4 bg-[#222f3e] p-4 mb-2 rounded-lg"
>
<div className="flex items-center space-x-2 col-span-2">

<h2 className="font-bold text-md m-0 text-[#ffffff]">Activities</h2>
</div>

<div className="col-span-1">
<h2 className="font-bold text-md m-0 text-[#ffffff]">Created By</h2>
</div>

<div className="w-[100px]">
<h2 className="font-bold text-md m-0 text-[#ffffff]">Status</h2>
</div>

<div className="col-span-2">
<h2 className="font-bold text-md m-0 text-[#ffffff]">Last Updated</h2>
</div>

</div>
                {memoizedActivities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} projectId={id}/>
               
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
