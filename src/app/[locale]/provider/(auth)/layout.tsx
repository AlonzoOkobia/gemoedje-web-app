import { Footer } from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-background py-20">{children}</main>
      <Footer />
    </>
  );
}
