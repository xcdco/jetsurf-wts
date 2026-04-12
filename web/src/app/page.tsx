import { AboutJetSurf } from "@/components/landing/AboutJetSurf";
import { Contact } from "@/components/landing/Contact";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { RentalVideos } from "@/components/landing/RentalVideos";
import { ModelCatalog } from "@/components/landing/ModelCatalog";
import { Pricing } from "@/components/landing/Pricing";
import { RentalIncludes } from "@/components/landing/RentalIncludes";
import { RentalTerms } from "@/components/landing/RentalTerms";
import { Reviews } from "@/components/landing/Reviews";
import { Services } from "@/components/landing/Services";
import { Steps } from "@/components/landing/Steps";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <RentalVideos />
        <AboutJetSurf />
        <ModelCatalog />
        <Services />
        <RentalIncludes />
        <RentalTerms />
        <Pricing />
        <Steps />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
