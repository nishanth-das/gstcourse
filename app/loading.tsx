import { Container } from "@/components/ui/container";

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent py-12">
      <Container className="max-w-md text-center flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[var(--color-surface)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </Container>
    </div>
  );
}
