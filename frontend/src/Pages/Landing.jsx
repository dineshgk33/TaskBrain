import React from 'react'
import Navbar from '../Components/navbar/Navbar.jsx';
import Hero from '../Components/Hero';
import Features from "../Components/Features";
import HowItWorks from '../Components/HowItWorks';
import FAQ from '../Components/FAQ';
import Footer from '../Components/Footer';



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