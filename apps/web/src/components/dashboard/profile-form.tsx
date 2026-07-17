"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/dashboard/profile/actions";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  college: z.string().min(2, "College name is required"),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ user }: { user: any }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      college: user.college || "",
      emergencyContact: user.emergencyContact || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Full Name</label>
          <Input {...form.register("name")} className="rounded-xl shadow-none" />
          {form.formState.errors.name && <p className="text-[11px] text-red-500">{form.formState.errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <Input {...form.register("email")} className="rounded-xl bg-gray-50 opacity-70 cursor-not-allowed shadow-none" readOnly />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Phone Number</label>
          <Input {...form.register("phone")} className="rounded-xl shadow-none" />
          {form.formState.errors.phone && <p className="text-[11px] text-red-500">{form.formState.errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">College / University</label>
          <Input {...form.register("college")} className="rounded-xl shadow-none" />
          {form.formState.errors.college && <p className="text-[11px] text-red-500">{form.formState.errors.college.message}</p>}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700">Emergency Contact (Name & Phone)</label>
          <Input {...form.register("emergencyContact")} placeholder="E.g. Jane Doe - 9876543210" className="rounded-xl shadow-none" />
          {form.formState.errors.emergencyContact && <p className="text-[11px] text-red-500">{form.formState.errors.emergencyContact.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading} className="rounded-full px-8 shadow-sm">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
