import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Features } from "@/components/features"
import { Process } from "@/components/process"
import { Testimonials } from "@/components/testimonials"
import { News } from "@/components/news"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <Features />
        <Process />
        <Testimonials />
        <News />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
