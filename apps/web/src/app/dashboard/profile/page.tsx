import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader
        title="Profile"
        description="Manage your personal information and emergency contacts."
      />

      <div className="rounded-[24px] border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[var(--tbu-hairline-strong)] bg-gray-200">
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
    </div>
  );
}
