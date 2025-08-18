"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TDropdownData } from "@/libs/types";
import { useUser } from "@/libs/userContext";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface SpecialtySelectorProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
  specialitiesData: TDropdownData[];
}

export function SpecialtySelector({
  selectedSpecialties,
  onSpecialtiesChange,
  specialitiesData,
}: SpecialtySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [justification, setJustification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  const toggleSpecialty = (specialty: string) => {
    onSpecialtiesChange(
      selectedSpecialties.includes(specialty)
        ? selectedSpecialties.filter((s) => s !== specialty)
        : [...selectedSpecialties, specialty],
    );
  };

  const handleSubmitRequest = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/providers/user-input-speciality", {
        method: "POST",
        body: JSON.stringify({
          name: newSpecialty,
          justification,
          email: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      toast.success("Request Submitted", {
        description: "Your specialty request has been submitted for review.",
      });

      setIsLoading(false);
      setIsDialogOpen(false);
      setNewSpecialty("");
      setJustification("");
    } catch (error) {
      setIsLoading(false);
      setIsDialogOpen(false);
      setNewSpecialty("");
      setJustification("");
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const t = useTranslations();

  const specialties = specialitiesData;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Available Specialties</Label>
        <Button
          variant="outline"
          type="button"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Request New
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {specialties.map((specialty, index) => (
          <Button
            key={`specialty-${specialty}-${index}`}
            type="button"
            variant={
              selectedSpecialties.includes(specialty.value)
                ? "default"
                : "outline"
            }
            className="!h-full justify-center !break-words !whitespace-normal"
            onClick={() => toggleSpecialty(specialty.value)}
          >
            {specialty.label}
          </Button>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Specialty</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty Name</Label>
              <Input
                id="specialty"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Enter the specialty name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Please explain why this specialty should be added and your qualifications"
                required
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitRequest} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
