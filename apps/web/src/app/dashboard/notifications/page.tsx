import { currentUser } from "@/lib/data/users";
import { getNotificationsByUserId } from "@/lib/data/notifications";
import { PageHeader } from "@/components/shared/page-header";
import { Bell, CheckCircle2, AlertCircle, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotificationsPage() {
  const user = currentUser;
  const notifications = getNotificationsByUserId(user.id);

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "WARNING":
      case "ALERT":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-[var(--tbu-blue)]" />;
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Notifications"
        description="Stay updated with your trips and account."
      />

      <div className="rounded-[24px] border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tbu-surface)]">
              <Bell className="h-8 w-8 text-[var(--tbu-muted)]" />
            </div>
            <h3 className="text-body font-bold text-[var(--tbu-ink)]">You&apos;re all caught up!</h3>
            <p className="mt-2 text-caption text-[var(--tbu-muted)]">
              No new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--tbu-hairline)]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "relative p-4 sm:p-6 transition-colors hover:bg-[var(--tbu-surface)]",
                  !notif.read && "bg-[var(--tbu-blue-soft)]"
                )}
              >
                {!notif.read && (
                  <div className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--tbu-blue)]" />
                )}
                
                <div className={cn("flex gap-4", !notif.read ? "ml-4" : "")}>
                  <div className="mt-1 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className={cn("font-bold text-body-sm", !notif.read ? "text-[var(--tbu-ink)]" : "text-[var(--tbu-muted)]")}>
                        {notif.title}
                      </h4>
                      <span className="shrink-0 text-[11px] text-[var(--tbu-muted)]">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-caption text-[var(--tbu-ink)]">
                      {notif.message}
                    </p>
                    
                    {notif.link && (
                      <Link 
                        href={notif.link}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--tbu-blue)] hover:underline"
                      >
                        View Details <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
