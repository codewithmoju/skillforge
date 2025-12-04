"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { submitReport } from "@/lib/services/reports";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetType: 'post' | 'comment' | 'user';
}

const REPORT_REASONS = [
    "Spam or misleading",
    "Harassment or hate speech",
    "Inappropriate content",
    "Violence or dangerous organizations",
    "Intellectual property violation",
    "Other"
];

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
    const { user } = useAuth();
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user) return;
        if (!reason) {
            toast.error("Please select a reason for reporting");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitReport({
                targetId,
                targetType,
                reason,
                description,
                reportedBy: user.uid
            });
            toast.success("Report submitted. Thank you for helping keep our community safe.");
            onClose();
        } catch (error) {
            console.error("Failed to submit report:", error);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Report Content
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Reason</label>
                        <Select onValueChange={setReason} value={reason}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                {REPORT_REASONS.map((r) => (
                                    <SelectItem key={r} value={r} className="focus:bg-slate-700 focus:text-slate-200 cursor-pointer">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Description (Optional)</label>
                        <Textarea
                            placeholder="Please provide more details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-slate-200 min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
