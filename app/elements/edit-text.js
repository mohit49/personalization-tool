import React, { useState  } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditTextPopup = ({ isOpen, onClose, initialText, onSave }) => {
  const [text, setText] = useState(initialText || '');

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <textarea
            value={text} className="h-[80px] border w-full p-4"
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter new text"
          />
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTextPopup;
