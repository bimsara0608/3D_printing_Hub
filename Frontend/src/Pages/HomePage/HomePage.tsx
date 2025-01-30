import CTASection from "../../Components/CTASection/CTASection"
import FeaturedProducts from "../../Components/FeaturedProducts/FeaturedProducts"
import Header from "../../Components/Header/Header"
import ProcessSection from "../../Components/ProcessSection/ProcessSection"
import ReviewSection from "../../Components/ReviewSection/ReviewSection"
import ServicesSection from "../../Components/ServiceSection/ServicesSection"

function HomePage() {
  return (
      <div>
      <Header />
      <ServicesSection/>
      <ProcessSection />
      <ReviewSection />
      <FeaturedProducts/>
      <CTASection/>
      </div>
  )
}

export default HomePage