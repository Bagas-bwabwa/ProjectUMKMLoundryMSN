/** Fallback Suspense ringkas untuk lazy-loaded route (materi: Lazy + Suspense). */
export function PageLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8 text-sm text-muted-foreground">
      Memuat halaman…
    </div>
  );
}
