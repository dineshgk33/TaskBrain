import React from 'react'
import Navbar from '../components/navbar/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Features from "../components/Features.jsx";
import HowItWorks from '../components/HowItWorks.jsx';
import FAQ from '../components/FAQ.jsx';
import Footer from '../components/Footer.jsx';



const Landing = () => {
  return (
    <div className='min-h-screen bg-white'>
    <Navbar/>
    <main className="pt-24">
    <Hero />
    <Features />
    <HowItWorks />
    <FAQ />
    <Footer />
  </main>
    </div>
  )
}

export default Landing
