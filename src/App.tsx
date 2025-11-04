import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Briefcase, Code, ExternalLink, FileText, Github, Linkedin, Mail, Menu, MessageCircle, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CustomCursor from './components/CustomCursor';
import DecryptText from './components/DecryptText';
import FluidDistortion from './components/FluidDistortion';
import Loading from './components/Loading';
import GlassCard from './components/glassCard';
import SocialIcon from './components/socialIcon';

// Import project images
import adminImage from './assets/project/admin.png';
import erpImage from './assets/project/erp.png';
import pokemonImage from './assets/project/pokemon.png';
import stackunImage from './assets/project/stackun.png';
import tictactoeImage from './assets/project/tictactoe.png';

interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
  image: string;
  link: string;
  year: number;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const xSpring = useSpring(cursorX, springConfig);
  const ySpring = useSpring(cursorY, springConfig);

  // Offset transforms to position image at bottom right of cursor
  const imageX = useTransform(xSpring, (v) => v + 20); // 20px offset to the right
  const imageY = useTransform(ySpring, (v) => v + 20); // 20px offset below cursor

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was on the "View Project" link to avoid double navigation
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      return; // Let the link handle its own click
    }
    window.open(project.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        ref={cardRef}
        className="relative cursor-pointer"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleCardClick}
      >
        <GlassCard
          className="p-8 group relative overflow-hidden"
          delay={index * 0.1}
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`absolute inset-0 bg-linear-to-br ${project.color} opacity-0 transition-opacity duration-300 rounded-3xl`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <span className="text-sm text-white/50 font-medium">{project.year}</span>
              </div>
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
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer w-fit"
              >
                View Project <ExternalLink size={18} />
              </motion.a>
            </div>
          </motion.div>
        </GlassCard>
      </div>

      {/* Floating Image Preview */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed pointer-events-none z-50"
            style={{
              left: imageX,
              top: imageY,
            }}
          >
            <motion.div
              className="w-80 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#0a0a1f', '#150a2e', '#0a0a1f']
  );

  const projects = [
    {
      title: 'Admin Dashboard',
      description: 'A modern admin dashboard solution with real-time data visualization and user management.',
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      color: 'from-purple-500 to-pink-500',
      image: adminImage,
      link: "https://admin-two-tau.vercel.app/",
      year: 2024
    },
    {
      title: 'ERP System',
      description: 'Enterprise resource planning system for managing business operations and workflows.',
      tags: ['React', 'Node.js', 'MongoDB'],
      color: 'from-blue-500 to-cyan-500',
      image: erpImage,
      link: "https://demo-erp-gray.vercel.app/",
      year: 2023
    },
    {
      title: 'Pokemon App',
      description: 'Interactive Pokemon application with search, filtering, and detailed information.',
      tags: ['React', 'Vite', 'Pokemon API', 'Express JS'],
      color: 'from-orange-500 to-red-500',
      image: pokemonImage,
      link: "https://pokemon-collection-game.vercel.app/",
      year: 2023
    },
    {
      title: 'Stackun Platform',
      description: 'Modern platform for developers to showcase their projects and connect.',
      tags: ['React', 'Next.js', 'GraphQL'],
      color: 'from-green-500 to-teal-500',
      image: stackunImage,
      link: "https://stackun.vercel.app/",
      year: 2023
    },
    {
      title: 'Tic Tac Toe Game',
      description: 'Classic tic tac toe game with modern UI and smooth animations.',
      tags: ['React', 'TypeScript', 'CSS'],
      color: 'from-yellow-500 to-orange-500',
      image: tictactoeImage,
      link: "https://neon-tic-tac-toe.vercel.app/",
      year: 2022
    },
  ];

  // Tech Stack organized by categories
  const techStack = {
    frontend: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Javascript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
      { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
      { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
    ],
    backend: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
      { name: 'Bun', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg' },
    ],
    database: [
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'MsSql Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
    ],
    tools: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    ],
  };

  // Loading state management
  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      // Simulate progressive loading
      const steps = [
        { progress: 20, delay: 200 },
        { progress: 40, delay: 400 },
        { progress: 60, delay: 600 },
        { progress: 80, delay: 400 },
        { progress: 95, delay: 300 },
        { progress: 100, delay: 200 },
      ];

      for (const step of steps) {
        if (!isMounted) return;
        await new Promise(resolve => setTimeout(resolve, step.delay));
        if (isMounted) {
          setLoadingProgress(step.progress);
        }
      }

      // Wait a bit before hiding loader for smooth transition
      if (isMounted) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
      }
    };

    // Check if images are already loaded
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if image fails
      });
    });

    // Check if fonts are loaded
    const initLoading = () => {
      if (isMounted) {
        loadAssets();
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initLoading);
    } else {
      initLoading();
    }

    // Also wait for images
    Promise.all(imagePromises).then(() => {
      if (isMounted) {
        setLoadingProgress(prev => prev < 100 ? 100 : prev);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'techstack', 'projects', 'contact'];
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
      {/* Loading Component */}
      <Loading isLoading={isLoading} progress={loadingProgress} />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Fluid Distortion Effect */}
      <FluidDistortion />

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
            William Wijaya
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {['Home', 'About', 'Tech Stack', 'Projects', 'Contact'].map((item) => {
              const sectionId = item.toLowerCase().replace(/\s+/g, '');
              return (
                <motion.a
                  key={item}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(sectionId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  className={`transition-all relative ${activeSection === sectionId
                    ? 'text-purple-400'
                    : 'text-white/70 hover:text-white'
                    }`}
                >
                  {item}
                  {activeSection === sectionId && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-purple-400 to-pink-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
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
                {['Home', 'About', 'Tech Stack', 'Projects', 'Contact'].map((item) => {
                  const sectionId = item.toLowerCase().replace(/\s+/g, '');
                  return (
                    <a
                      key={item}
                      href={`#${sectionId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(sectionId);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        setMenuOpen(false);
                      }}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 z-20">
        <div className="max-w-6xl mx-auto z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 "
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
              className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto text-center"
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
            <div className="flex items-center gap-4 mb-12">
              <User className="text-purple-400 w-10 h-10 md:w-12 md:h-12" />
              <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <DecryptText speed={30} delay={200}>
                  About Me
                </DecryptText>
              </h2>
            </div>
            <GlassCard className="p-8" delay={0.1}>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                <DecryptText speed={3} delay={50}>
                  Hi, I'm a developer with over 2 years of experience building modern web
                  and mobile applications. I enjoy crafting clean, user-focused designs and turning
                  ideas into interactive digital experiences. I'm always exploring new technologies
                  to improve my skills and create better solutions.
                </DecryptText>
              </p>
              <motion.a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all w-fit ml-auto"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                }}
              >
                <FileText size={20} />
                <span className="hidden sm:inline">View Resume</span>
              </motion.a>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="techstack" className="relative py-32 px-6 z-20">

        <div className="max-w-6xl mx-auto z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16"
          >
            <Code className="text-purple-400 w-10 h-10 md:w-12 md:h-12" />
            <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <DecryptText speed={30} delay={200}>
                My Tech Stack
              </DecryptText>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Frontend */}
            <GlassCard className="p-8" delay={0.1}>
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Frontend</h3>
              <div className="flex flex-wrap gap-4">
                {techStack.frontend.map((tech) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-12 h-12"
                      onError={(e) => {
                        // Fallback if icon fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Backend */}
            <GlassCard className="p-8" delay={0.1}>
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Backend</h3>
              <div className="flex flex-wrap gap-4">
                {techStack.backend.map((tech) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-12 h-12"
                      onError={(e) => {
                        // Fallback if icon fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>


            {/* Database */}
            <GlassCard className="p-8" delay={0.3}>
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Database</h3>
              <div className="flex flex-wrap gap-4">
                {techStack.database.map((tech) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-12 h-12"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Tools */}
            <GlassCard className="p-8" delay={0.4}>
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Tools</h3>
              <div className="flex flex-wrap gap-4">
                {techStack.tools.map((tech) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-12 h-12"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-medium">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-32 px-6 z-20">
        <div className="max-w-6xl mx-auto z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16"
          >
            <Briefcase className="text-purple-400 w-10 h-10 md:w-12 md:h-12" />
            <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <DecryptText speed={30} delay={200}>
                Featured Projects
              </DecryptText>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <MessageCircle className="text-purple-400 w-10 h-10 md:w-12 md:h-12" />
              <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <DecryptText speed={30} delay={200}>
                  Let's Connect
                </DecryptText>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
            >
              <DecryptText speed={3} delay={200}>
                Have a project in mind or just want to chat? I'm always open to discussing new opportunities
                and creative ideas.
              </DecryptText>
            </motion.p>
            <div className="flex justify-center gap-6">
              {[
                { icon: Github, label: 'GitHub', href: 'https://github.com/code4space' },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/william-wijaya-2a22871b2/' },
                { icon: Mail, label: 'Email', href: 'mailto:mauritius.william.wijaya1@gmail.com?subject=Hey!%20Let\'s%20Work%20Together%20🚀&body=Hey%20William!%0A%0AI%20came%20across%20your%20portfolio%20and%20I\'d%20love%20to%20chat%20about%20working%20together%20on%20a%20project%20or%20discussing%20a%20work%20opportunity!%0A%0ALooking%20forward%20to%20hearing%20from%20you!%20😊' },
              ].map(({ icon: Icon, label, href }) => (
                <SocialIcon key={label} Icon={Icon} label={label} href={href} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/10 backdrop-blur-2xl bg-black/10 z-20">
        <div className="max-w-7xl mx-auto text-center text-white/50">
          <p>© 2025 William. Crafted with passion and code.</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Portfolio;