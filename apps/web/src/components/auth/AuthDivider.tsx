export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--tbu-hairline)]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[var(--tbu-canvas)] px-4 text-caption text-[var(--tbu-faint)]">
          or continue with email
        </span>
      </div>
    </div>
  );
}
