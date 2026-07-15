"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { currentUser } from "@/lib/data/users";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  college: z.string().min(2, "College name is required"),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency phone is too short"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = currentUser;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      college: user.college,
      emergencyContact: user.emergencyContact || "",
      emergencyPhone: user.emergencyPhone || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Profile updated:", data);
    // TODO: Add toast notification
  };

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Profile"
        description="Manage your personal information and emergency contacts."
      />

      <div className="rounded-[24px] border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[var(--tbu-hairline-strong)]">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <Button variant="outline" className="rounded-full shadow-sm text-caption font-semibold">
                Change Avatar
              </Button>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-caption font-semibold text-[var(--tbu-ink)]">Full Name</label>
                <Input
                  {...form.register("name")}
                  className="rounded-xl shadow-none"
                />
                {form.formState.errors.name && (
                  <p className="text-[11px] text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-caption font-semibold text-[var(--tbu-ink)]">Email Address</label>
                <Input
                  {...form.register("email")}
                  className="rounded-xl bg-[var(--tbu-surface)] opacity-70 cursor-not-allowed shadow-none"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="text-caption font-semibold text-[var(--tbu-ink)]">Phone Number</label>
                <Input
                  {...form.register("phone")}
                  className="rounded-xl shadow-none"
                />
                {form.formState.errors.phone && (
                  <p className="text-[11px] text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-caption font-semibold text-[var(--tbu-ink)]">College / University</label>
                <Input
                  {...form.register("college")}
                  className="rounded-xl shadow-none"
                />
                {form.formState.errors.college && (
                  <p className="text-[11px] text-red-500">{form.formState.errors.college.message}</p>
                )}
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-[var(--tbu-hairline)]">
              <h3 className="text-body font-bold text-[var(--tbu-ink)] mb-6">Emergency Contact</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-caption font-semibold text-[var(--tbu-ink)]">Contact Name</label>
                  <Input
                    {...form.register("emergencyContact")}
                    className="rounded-xl shadow-none"
                  />
                  {form.formState.errors.emergencyContact && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.emergencyContact.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-caption font-semibold text-[var(--tbu-ink)]">Contact Phone</label>
                  <Input
                    {...form.register("emergencyPhone")}
                    className="rounded-xl shadow-none"
                  />
                  {form.formState.errors.emergencyPhone && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.emergencyPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <Button type="submit" className="rounded-full shadow-sm px-8">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
