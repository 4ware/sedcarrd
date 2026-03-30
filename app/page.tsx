import AppScreen from "@/features/home/components/app-screen";
import Footer from "@/features/home/components/footer";
import Hero from "@/features/home/components/hero";
import { HomeLayout } from "@/features/home/components/home-layout";

export default function Home() {
  return (
    <HomeLayout>
      <Hero />
      <AppScreen />
      <Footer />
    </HomeLayout>
  );
}
