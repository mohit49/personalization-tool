import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { useEffect, useState , useContext } from "react";
  
  export function Dialog({open, setOpen , children}) {
  
    return (
      <AlertDialog  open={open} onOpenChange={setOpen}>
       
       {children}
      </AlertDialog>
    )
  }
  