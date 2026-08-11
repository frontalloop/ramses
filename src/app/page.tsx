import About from "@/components/About";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Equipment from "@/components/Equipment";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Locations from "@/components/Locations";
import Operations from "@/components/Operations";
import Quality from "@/components/Quality";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Vmv from "@/components/Vmv";
import WhatsAppFab from "@/components/WhatsAppFab";
import WhyUs from "@/components/WhyUs";

export default function Page() {
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Vmv />
        <Services />
        <Operations />
        <Equipment />
        <WhyUs />
        <Quality />
        <Clients />
        <FinalCta />
        <Contact />
        <Locations />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
