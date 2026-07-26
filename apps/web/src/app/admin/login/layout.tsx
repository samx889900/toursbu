export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {children}
    </div>
  );
}
