import { motion } from 'framer-motion';
import { Rocket, Target, Database, Zap, Shield, Globe, Users, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: Target,
      title: '3D Orbital Visualization',
      description: 'Real-time 3D rendering of asteroid trajectories using React Three Fiber and Three.js, providing immersive visualization of near-Earth objects.'
    },
    {
      icon: Database,
      title: 'NASA Data Integration',
      description: 'Direct integration with NASA\'s Near-Earth Object API, accessing data on 40,000+ asteroids with real orbital parameters and characteristics.'
    },
    {
      icon: Zap,
      title: 'Physics-Based Simulation',
      description: 'Accurate impact energy calculations, crater size estimation, and seismic magnitude prediction using established scientific models.'
    },
    {
      icon: Shield,
      title: 'Planetary Defense Testing',
      description: 'Test multiple deflection strategies including kinetic impactors, ion thrusters, and gravity tractors to evaluate Earth protection scenarios.'
    },
    {
      icon: Globe,
      title: 'Interactive Impact Maps',
      description: 'Visualize potential impact locations and affected zones on interactive maps powered by Leaflet.js with real geographic data.'
    },
    {
      icon: Users,
      title: 'Educational Platform',
      description: 'Accessible interface designed for scientists, educators, policymakers, and the public to understand asteroid threats and mitigation.'
    }
  ];

  const technologies = [
    { name: 'React.js', purpose: 'Frontend framework' },
    { name: 'React Three Fiber', purpose: '3D visualization' },
    { name: 'Three.js', purpose: '3D graphics engine' },
    { name: 'Framer Motion', purpose: 'Animations' },
    { name: 'Leaflet.js', purpose: 'Interactive maps' },
    { name: 'Zustand', purpose: 'State management' },
    { name: 'TailwindCSS', purpose: 'Styling system' },
    { name: 'NASA NEO API', purpose: 'Asteroid data' }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-block p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-6">
                <Rocket className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About AstroViz
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AstroViz is an interactive asteroid impact visualization and simulation platform created for the 
                <span className="text-primary font-semibold"> 2025 NASA Space Apps Challenge</span>. Our mission is to transform 
                complex astronomical data into an accessible, educational tool for understanding and mitigating asteroid threats.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Challenge Background */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">The Challenge: Meteor Madness</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The discovery of near-Earth asteroids like "Impactor-2025" highlights the ongoing risk of celestial 
                collisions. Current tools often lack user-friendly interfaces and fail to integrate diverse datasets 
                from NASA and USGS effectively.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-background rounded-xl border border-border"
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">The Problem</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">▸</span>
                    Siloed datasets across NASA and USGS
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">▸</span>
                    Limited tools for simulating impact consequences
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">▸</span>
                    Gap between complex science and public understanding
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">▸</span>
                    Insufficient visualization of mitigation strategies
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-background rounded-xl border border-border"
              >
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Solution</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Integrated NASA and USGS data in one platform
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Real-time 3D simulations with accurate physics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Intuitive interface for all audiences
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Interactive defense strategy testing
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive tools for asteroid threat analysis and education
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="p-6 bg-card border border-border rounded-xl hover:border-primary transition-all"
                >
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
              <p className="text-xl text-muted-foreground">
                Built with modern web technologies for optimal performance
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-background rounded-lg border border-border text-center hover:border-primary transition-all"
                >
                  <p className="font-bold mb-1">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.purpose}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                To empower scientists, policymakers, educators, and the public with accurate, accessible tools 
                for understanding asteroid threats and evaluating planetary defense strategies. Through innovative 
                visualization and simulation, we bridge the gap between complex astronomical science and actionable insights.
              </p>
              <div className="inline-block p-6 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-xl border border-primary/30">
                <p className="text-lg font-semibold text-foreground">
                  "Making asteroid science accessible to everyone, one simulation at a time."
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-6">Data Sources</h2>
              <p className="text-xl text-muted-foreground mb-8">
                AstroViz leverages official data from leading space and geological organizations
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-background rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-3 text-primary">NASA NEO Program</h3>
                  <p className="text-muted-foreground mb-4">
                    Access to 40,000+ near-Earth asteroid records with orbital parameters, physical characteristics, 
                    and approach data through NASA's official API.
                  </p>
                  <a 
                    href="https://api.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit NASA API →
                  </a>
                </div>
                <div className="p-6 bg-background rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-3 text-secondary">USGS Datasets</h3>
                  <p className="text-muted-foreground mb-4">
                    Environmental and geological data including topography, seismic activity zones, and coastal 
                    elevation for accurate impact modeling.
                  </p>
                  <a 
                    href="https://www.usgs.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline"
                  >
                    Visit USGS →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start simulating asteroid impacts and testing planetary defense strategies today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/simulator"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all inline-flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Launch Simulator
              </Link>
              <Link
                to="/explore"
                className="px-8 py-4 bg-muted text-foreground font-bold rounded-lg hover:bg-muted/80 transition-all inline-flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Explore Asteroids
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
