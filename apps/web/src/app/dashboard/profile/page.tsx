import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Shield, Bell, FileText, UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="Account Settings"
        description="Manage your personal information, preferences, and account security."
      />

      <div className="space-y-6">
        {/* Personal Info & Emergency Contact (ProfileForm handles this) */}
        <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <UserCircle className="w-5 h-5 text-[var(--tbu-blue)]" />
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 shrink-0">
                {user.image && <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />}
              </div>
              <div>
                <Button variant="outline" className="rounded-full shadow-sm text-sm font-semibold">
                  Change Avatar
                </Button>
              </div>
            </div>

            <ProfileForm user={user} />
          </div>
        </div>

        {/* Security / Danger Zone */}
        <div className="rounded-[24px] border border-red-100 bg-red-50/30 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-red-100 pb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-red-900">Security & Account</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">Log out of your account on this device.</p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
