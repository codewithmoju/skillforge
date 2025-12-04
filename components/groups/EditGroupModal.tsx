"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Loader2 } from "lucide-react";
import { updateGroup } from "@/lib/services/groups";
import { toast } from "sonner";
import { Group } from "@/lib/services/groups";

interface EditGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group;
    onUpdate: (updatedGroup: Partial<Group>) => void;
}

export function EditGroupModal({ isOpen, onClose, group, onUpdate }: EditGroupModalProps) {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);
    const [imageUrl, setImageUrl] = useState(group.imageUrl || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateGroup(group.id, {
                name,
                description,
                imageUrl
            });
            onUpdate({ name, description, imageUrl });
            toast.success("Group updated successfully");
            onClose();
        } catch (error) {
            console.error("Error updating group:", error);
            toast.error("Failed to update group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Group Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Cover Image URL</Label>
                        <Input
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white"
                            placeholder="https://..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-accent-indigo hover:bg-accent-indigo/90">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
