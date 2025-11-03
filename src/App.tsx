
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FluidDistortion from './components/FluidDistortion';

const LiquidBlob = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30"
      style={{
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const GlassCard = ({ children, className = '', delay = 0 }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 overflow-hidden ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 0 60px rgba(102, 126, 234, 0.3), inset 0 0 60px rgba(255, 255, 255, 0.05)`
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#0a0a1f', '#150a2e', '#0a0a1f']
  );

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution with real-time inventory and seamless checkout experience.',
      tags: ['React', 'Node.js', 'MongoDB'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI Content Generator',
      description: 'Machine learning powered content creation tool with natural language processing.',
      tags: ['Python', 'TensorFlow', 'React'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Portfolio CMS',
      description: 'Headless CMS designed specifically for creative portfolios and agencies.',
      tags: ['Next.js', 'GraphQL', 'Prisma'],
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Real-time Analytics',
      description: 'Dashboard for visualizing complex data streams with live updates and insights.',
      tags: ['Vue.js', 'D3.js', 'WebSocket'],
      color: 'from-green-500 to-teal-500',
    },
  ];

  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'GraphQL',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Figma'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;

      if (isNearBottom) {
        setActiveSection('contact');
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop - 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{ backgroundColor }}
      className="min-h-screen text-white overflow-hidden relative"
    >
      {/* Fluid Distortion Effect */}
      <FluidDistortion />

      {/* Liquid Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <LiquidBlob delay={0} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96">
          <LiquidBlob delay={2} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80">
          <LiquidBlob delay={4} />
        </div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72">
          <LiquidBlob delay={6} />
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/10 border-b border-white/10"
        style={{
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
            }}
          >
            Portfolio
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {['Home', 'About', 'Projects', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.1 }}
                className={`transition-all relative ${activeSection === item.toLowerCase()
                  ? 'text-purple-400'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-purple-400 to-pink-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden backdrop-blur-2xl bg-black/20 border-t border-white/10"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.toLowerCase());
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      setMenuOpen(false);
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 z-20">
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
             <motion.h1
               className="text-6xl md:text-8xl font-bold mb-6"
               animate={{
                 backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
               }}
               transition={{ duration: 5, repeat: Infinity }}
               style={{
                 backgroundImage: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #667eea)',
                 backgroundSize: '200% 200%',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
                 filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.5))',
               }}
             >
               Creative Developer
             </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto"
            >
              Crafting immersive digital experiences with cutting-edge technology and innovative design
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('projects');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-full font-semibold flex items-center gap-2 backdrop-blur-sm"
              >
                View Projects <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                }}
              >
                Get in Touch
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6 z-20">
        <div className="max-w-6xl mx-auto z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-12 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-8" delay={0.1}>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  I'm a passionate full-stack developer with a keen eye for design and a love for creating
                  seamless user experiences. With expertise in modern web technologies, I transform complex
                  problems into elegant solutions.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                  projects, or capturing moments through photography.
                </p>
              </GlassCard>
              <GlassCard className="p-8" delay={0.2}>
                <h3 className="text-2xl font-semibold mb-6">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="px-4 py-2 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-32 px-6 z-20">
        <div className="max-w-7xl mx-auto z-10 relative">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Featured Projects
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <GlassCard key={project.title} className="p-8 group" delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${project.color} opacity-0 transition-opacity duration-300 rounded-3xl`} />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-white/70 mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 backdrop-blur-xl bg-white/10 rounded-full text-sm border border-white/10"
                          style={{
                            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Project <ExternalLink size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6 z-20">
        <div className="max-w-4xl mx-auto z-10 relative text-center">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div style={{ width: '200px', height: '200px' }}>
                <DotLottieReact
                  src="https://lottie.host/fbd88c92-2bd6-4a6e-be29-aac6b3c761a3/q32nqkZaxN.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-8 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Let's Connect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
            >
              Have a project in mind or just want to chat? I'm always open to discussing new opportunities
              and creative ideas.
            </motion.p>
            <div className="flex justify-center gap-6">
              {[
                { icon: Github, label: 'GitHub', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Mail, label: 'Email', href: 'mailto:hello@example.com' },
              ].map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="p-4 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                  aria-label={label}
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/10 backdrop-blur-2xl bg-black/10 z-20">
        <div className="max-w-7xl mx-auto text-center text-white/50">
          <p>© 2025 Portfolio. Crafted with passion and code.</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Portfolio;