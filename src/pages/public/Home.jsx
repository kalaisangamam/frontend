import React from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import Hero from '../../components/home/Hero.jsx';
import About from '../../components/home/About.jsx';
import WhyChooseUs from '../../components/home/WhyChooseUs.jsx';
import Programs from '../../components/programs/Programs.jsx';
import Masters from '../../components/masters/Masters.jsx';
import Achievements from '../../components/home/Achievements.jsx';
import Gallery from '../../components/gallery/Gallery.jsx';
import Events from '../../components/events/Events.jsx';
import Testimonials from '../../components/home/Testimonials.jsx';
import FAQ from '../../components/home/FAQ.jsx';
import Contact from '../../components/common/Contact.jsx';
const Home = () => (
  <PublicLayout>
    <Hero />
    <About />
    <WhyChooseUs />
    <Programs />
    <Masters limit={3} showViewAll />
    <Achievements />
    <Gallery preview />
    <Events preview />
    <Testimonials />
    <FAQ />
    <Contact />
  </PublicLayout>
);

export default Home;
