import React from 'react'
import Navbar from '../components/navbar/Navbar.jsx';
import Hero from '../components/Hero';
import Features from "../components/Features";
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';



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
