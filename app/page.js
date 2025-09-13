 'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '',
    company: '',
    budget: '',
    timeline: '',
    services: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const titleWrapRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const vignetteRef = useRef(null);
  const heroPopRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mouse-driven parallax for hero background orbs
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (event.clientY / innerHeight - 0.5) * 2; // -1 to 1

      window.requestAnimationFrame(() => {
        if (orb1Ref.current) {
          orb1Ref.current.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
        }
        if (orb2Ref.current) {
          orb2Ref.current.style.transform = `translate3d(${x * -16}px, ${y * -14}px, 0)`;
        }
        if (orb3Ref.current) {
          orb3Ref.current.style.transform = `translate3d(${x * 8}px, ${y * -6}px, 0)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP scroll-based hero animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!heroRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Ensure initial states on wrapper (start normal, then grow on scroll)
      if (titleWrapRef.current) {
        gsap.set(titleWrapRef.current, { transformOrigin: '50% 50%', scale: 1, autoAlpha: 1 });
      }
      const toHide = gsap.utils.toArray('[data-hide-on-scroll]');
      if (toHide.length) gsap.set(toHide, { autoAlpha: 1, y: 0 });
      if (heroRef.current) gsap.set(heroRef.current, { perspective: 1200, transformStyle: 'preserve-3d' });

      const computeOffsets = () => {
        if (!heroRef.current) return;
        const heroTop = heroRef.current.getBoundingClientRect().top + window.scrollY;
        toHide.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + window.scrollY;
          // Distance needed to move element so its top touches hero's top (with a small padding)
          const dy = (elTop - heroTop) + 8; // 8px padding from very top
          el._dyToTop = dy;
        });
      };

      computeOffsets();
      ScrollTrigger.addEventListener('refreshInit', computeOffsets);
      if (headerRef.current) gsap.set(headerRef.current, { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onLeave: () => {
            // Snap to services immediately when hero animation completes
            const servicesEl = document.getElementById('services');
            if (servicesEl) {
              const top = servicesEl.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top, behavior: 'auto' });
            }
          }
        }
      });

      // Zoom IN (scale up), lift slightly, and blur title while fading; hide other hero content; hide header
      if (titleWrapRef.current) {
        tl.to(titleWrapRef.current, { 
          scale: 3.6, 
          y: -40,
          filter: 'blur(6px)',
          transformPerspective: 800,
          rotationX: -8,
          rotationY: 12,
          z: 160,
          autoAlpha: 0, 
          ease: 'power2.out', 
          overwrite: 'auto' 
        }, 0);
      }
      if (toHide.length) tl.to(toHide, { 
        autoAlpha: 0, 
        ease: 'power2.out',
        stagger: { each: 0.08 }
      }, 0);
      if (headerRef.current) tl.to(headerRef.current, { autoAlpha: 0, y: -80, ease: 'power1.out' }, 0);

      // Deepen/dim the background grid subtly during scroll
      if (gridRef.current) {
        tl.to(gridRef.current, { autoAlpha: 0.2, y: -60, ease: 'none' }, 0);
      }

      // Enrich ambient orbs during the scroll
      const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current].filter(Boolean);
      if (orbs.length) {
        tl.to(orb1Ref.current, { scale: 1.25, autoAlpha: 0.7, z: -80, ease: 'power1.out' }, 0);
        tl.to(orb2Ref.current, { scale: 1.35, autoAlpha: 0.6, z: -120, ease: 'power1.out' }, 0);
        tl.to(orb3Ref.current, { scale: 1.1, autoAlpha: 0.5, z: -60, ease: 'power1.out' }, 0);
      }

      // Vignette overlay for cinematic depth
      if (vignetteRef.current) {
        gsap.set(vignetteRef.current, { autoAlpha: 0 });
        tl.to(vignetteRef.current, { autoAlpha: 0.8, ease: 'none' }, 0.15);
        tl.to(vignetteRef.current, { autoAlpha: 0.0, ease: 'none' }, 0.9);
      }

      // Pop-out teaser content at bottom of hero during mid scroll only
      if (heroPopRef.current) {
        gsap.set(heroPopRef.current, { autoAlpha: 0, y: 24, scale: 0.95 });
        tl.to(heroPopRef.current, { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out' }, 0.35);
        tl.to(heroPopRef.current, { autoAlpha: 0, y: -24, ease: 'power2.in' }, 0.8);
      }

      // Keep header visible for all sections after hero (both directions)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'bottom top',
        end: 'max',
        onEnter: () => {
          if (!headerRef.current) return;
          gsap.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        },
        onEnterBack: () => {
          if (!headerRef.current) return;
          gsap.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          if (!headerRef.current) return;
          gsap.to(headerRef.current, { autoAlpha: 0, y: -80, duration: 0.25, ease: 'power2.in' });
        }
      });

      // Reveal pricing cards on scroll
      const pricingCards = gsap.utils.toArray('.pricing-card');
      if (pricingCards.length) {
        gsap.set(pricingCards, { autoAlpha: 0, y: 40 });
        gsap.to(pricingCards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '#pricing',
            start: 'top 70%'
          }
        });
      }

      // Reveal contact section blocks on scroll
      const contactBlocks = gsap.utils.toArray('.contact-reveal');
      if (contactBlocks.length) {
        gsap.set(contactBlocks, { autoAlpha: 0, y: 30 });
        gsap.to(contactBlocks, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%'
          }
        });
      }

      // Reveal industry cards on scroll
      const industryCards = gsap.utils.toArray('.industry-card');
      if (industryCards.length) {
        gsap.set(industryCards, { autoAlpha: 0, y: 30 });
        gsap.to(industryCards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '#industries',
            start: 'top 70%'
          }
        });
        // Interactive hover tilt and glow
        gsap.set(industryCards, { transformPerspective: 900, transformStyle: 'preserve-3d' });
        const handlerRecords = [];
        industryCards.forEach((card) => {
          const onEnter = () => {
            gsap.to(card, { boxShadow: '0 14px 48px rgba(59,130,246,0.25)', duration: 0.25, ease: 'power2.out' });
          };
          const onMove = (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
            const py = (e.clientY - rect.top) / rect.height - 0.5; // -0.5..0.5
            const rotateY = px * 10; // left/right
            const rotateX = -py * 10; // up/down
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, z: 10, duration: 0.2, ease: 'power2.out' });
          };
          const onLeave = () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, z: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3, ease: 'power2.out' });
          };
          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mousemove', onMove);
          card.addEventListener('mouseleave', onLeave);
          handlerRecords.push({ card, onEnter, onMove, onLeave });
        });
        ScrollTrigger.addEventListener('killAll', () => {
          handlerRecords.forEach(({ card, onEnter, onMove, onLeave }) => {
            card.removeEventListener('mouseenter', onEnter);
            card.removeEventListener('mousemove', onMove);
            card.removeEventListener('mouseleave', onLeave);
          });
        });
      }

      // Reveal service cards on scroll into view
      const cards = gsap.utils.toArray('.service-card');
      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '#services',
            start: 'top 70%',
          }
        });
      }
    }, heroRef);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', computeOffsets);
      ctx.revert();
    };
  }, []);

  const handleHeroMouseMove = (event) => {
    if (!heroRef.current || !titleRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    window.requestAnimationFrame(() => {
      titleRef.current.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
    });
  };

  const handleHeroMouseLeave = () => {
    if (!titleRef.current) return;
    titleRef.current.style.transform = 'translate3d(0,0,0)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.message) errors.message = 'Message is required';
    if (!formData.company) errors.company = 'Company name is required';
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('access_key', 'bf4a41fe-4223-464a-8675-766bdb71074b');
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('company', formData.company);
        formDataToSend.append('budget', formData.budget);
        formDataToSend.append('timeline', formData.timeline);
        formDataToSend.append('services', formData.services.join(', '));
        formDataToSend.append('message', formData.message);
        formDataToSend.append('subject', 'New Contact Form Submission from SitaraWeb.tech');
        
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formDataToSend
        });
        
        if (response.ok) {
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ 
              name: '', 
              email: '', 
              message: '',
              company: '',
              budget: '',
              timeline: '',
              services: [] 
            });
            setFormErrors({});
          }, 5000);
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setFormErrors({ submit: 'Failed to send message. Please try again.' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const services = [...formData.services];
      if (checked) {
        services.push(value);
      } else {
        const index = services.indexOf(value);
        if (index > -1) {
          services.splice(index, 1);
        }
      }
      setFormData({ ...formData, services });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // In a real implementation, this would navigate to a dedicated page
    alert(`Redirecting to detailed research for: ${category.name}\n\n${category.impact}\n\nGet your FREE customized website strategy!`);
  };

  const businessCategories = [
    { 
      name: 'E-Commerce', 
      icon: '🛒',
      impact: 'Online stores see 200% more revenue with optimized websites. Get your FREE e-commerce strategy now!' 
    },
    { 
      name: 'Healthcare', 
      icon: '🏥',
      impact: 'Clinics with websites attract 3x more patients. FREE analysis of your healthcare digital presence.' 
    },
    { 
      name: 'Restaurants', 
      icon: '🍽️',
      impact: 'Restaurants with online ordering earn 2.5x more. FREE assessment of your food business potential.' 
    },
    { 
      name: 'Real Estate', 
      icon: '🏢',
      impact: 'Realtors with professional websites close 60% more deals. FREE real estate market analysis.' 
    },
    { 
      name: 'Education', 
      icon: '🎓',
      impact: 'Educational institutes with websites see 3x more enrollment. FREE education sector website audit.' 
    },
    { 
      name: 'Finance', 
      icon: '💼',
      impact: 'Financial advisors with websites gain 80% more clients. FREE finance industry website assessment.' 
    },
    { 
      name: 'Travel', 
      icon: '✈️',
      impact: 'Travel businesses with optimized sites book 2.2x more trips. FREE travel industry website analysis.' 
    },
    { 
      name: 'Technology', 
      icon: '💻',
      impact: 'Tech companies with great websites attract 3x more leads. FREE tech website evaluation.' 
    },
    { 
      name: 'Legal', 
      icon: '⚖️',
      impact: 'Law firms with professional websites get 70% more cases. FREE legal website assessment.' 
    },
    { 
      name: 'Construction', 
      icon: '🏗️',
      impact: 'Construction companies with websites win 2x more projects. FREE construction industry analysis.' 
    },
    { 
      name: 'Beauty', 
      icon: '💄',
      impact: 'Salons with booking websites see 3x more appointments. FREE beauty industry website review.' 
    },
    { 
      name: 'Automotive', 
      icon: '🚗',
      impact: 'Auto businesses with websites sell 2.5x more vehicles. FREE automotive website strategy.' 
    },
    { 
      name: 'Non-Profit', 
      icon: '🤝',
      impact: 'Non-profits with websites receive 3x more donations. FREE nonprofit digital presence analysis.' 
    },
    { 
      name: 'Entertainment', 
      icon: '🎬',
      impact: 'Entertainment sites with good UX have 4x engagement. FREE entertainment website evaluation.' 
    },
    { 
      name: 'Manufacturing', 
      icon: '🏭',
      impact: 'Manufacturers with websites get 2.8x more B2B leads. FREE industrial website assessment.' 
    },
    { 
      name: 'Other', 
      icon: '🔍',
      impact: 'Businesses with professional websites grow 2.5x faster. FREE customized website strategy!' 
    }
  ];

  // Accent colors per industry for unique card theming
  const industryAccents = {
    Finance: { from: '#10b981', to: '#34d399', shadow: 'rgba(16,185,129,0.32)' },
    Healthcare: { from: '#06b6d4', to: '#22d3ee', shadow: 'rgba(6,182,212,0.32)' },
    Technology: { from: '#6366f1', to: '#22d3ee', shadow: 'rgba(99,102,241,0.32)' },
    Restaurants: { from: '#f59e0b', to: '#f97316', shadow: 'rgba(245,158,11,0.32)' },
    Education: { from: '#3b82f6', to: '#8b5cf6', shadow: 'rgba(59,130,246,0.32)' },
    'E-Commerce': { from: '#8b5cf6', to: '#22d3ee', shadow: 'rgba(139,92,246,0.32)' },
    Beauty: { from: '#ec4899', to: '#a855f7', shadow: 'rgba(236,72,153,0.32)' },
    Travel: { from: '#22d3ee', to: '#06b6d4', shadow: 'rgba(34,211,238,0.32)' },
    Legal: { from: '#a78bfa', to: '#60a5fa', shadow: 'rgba(96,165,250,0.32)' },
    Construction: { from: '#f97316', to: '#f59e0b', shadow: 'rgba(249,115,22,0.32)' },
    Default: { from: '#3b82f6', to: '#8b5cf6', shadow: 'rgba(59,130,246,0.32)' }
  };
  const getIndustryAccent = (name) => industryAccents[name] || industryAccents.Default;

  // Render a simple SVG per industry for a more professional look
  const renderIndustryIcon = (name) => {
    const baseProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (name) {
      case 'E-Commerce':
        return (
          <svg {...baseProps}>
            <path d="M6 6h15l-1.5 9h-12z"/>
            <circle cx="9" cy="19" r="1.5"/>
            <circle cx="17" cy="19" r="1.5"/>
            <path d="M3 6h2"/>
          </svg>
        );
      case 'Healthcare':
        return (
          <svg {...baseProps}>
            <rect x="4" y="4" width="16" height="16" rx="3"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
        );
      case 'Restaurants':
        return (
          <svg {...baseProps}>
            <path d="M6 3v8a3 3 0 0 0 6 0V3"/>
            <path d="M18 3v12"/>
            <path d="M18 11h-4"/>
          </svg>
        );
      case 'Real Estate':
        return (
          <svg {...baseProps}>
            <path d="M3 12l9-7 9 7"/>
            <path d="M5 10v10h14V10"/>
            <path d="M9 20v-6h6v6"/>
          </svg>
        );
      case 'Education':
        return (
          <svg {...baseProps}>
            <path d="M3 7l9-4 9 4-9 4-9-4z"/>
            <path d="M21 10v4"/>
            <path d="M3 10v4l9 4 9-4"/>
          </svg>
        );
      case 'Finance':
        return (
          <svg {...baseProps}>
            <rect x="3" y="7" width="4" height="14" rx="1"/>
            <rect x="10" y="3" width="4" height="18" rx="1"/>
            <rect x="17" y="10" width="4" height="11" rx="1"/>
          </svg>
        );
      case 'Travel':
        return (
          <svg {...baseProps}>
            <path d="M10 21l2-6 8-5-1-2-8 3-4-7-2 1 3 7-5 2 1 2 6-1"/>
          </svg>
        );
      case 'Technology':
        return (
          <svg {...baseProps}>
            <rect x="3" y="5" width="18" height="12" rx="2"/>
            <path d="M8 21h8"/>
            <path d="M12 17v4"/>
          </svg>
        );
      case 'Legal':
        return (
          <svg {...baseProps}>
            <path d="M12 3l7 4-7 4-7-4 7-4z"/>
            <path d="M5 10v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
          </svg>
        );
      case 'Construction':
        return (
          <svg {...baseProps}>
            <path d="M3 21h18"/>
            <path d="M6 21v-8h4v8"/>
            <path d="M14 21v-5h4v5"/>
            <path d="M10 7l2-4 2 4"/>
          </svg>
        );
      case 'Beauty':
        return (
          <svg {...baseProps}>
            <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8z"/>
            <path d="M12 14v8"/>
          </svg>
        );
      case 'Automotive':
        return (
          <svg {...baseProps}>
            <path d="M3 13l3-5h12l3 5"/>
            <rect x="2" y="13" width="20" height="5" rx="1"/>
            <circle cx="7" cy="19" r="1.5"/>
            <circle cx="17" cy="19" r="1.5"/>
          </svg>
        );
      case 'Non-Profit':
        return (
          <svg {...baseProps}>
            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10z"/>
          </svg>
        );
      case 'Entertainment':
        return (
          <svg {...baseProps}>
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="M9 8l6 4-6 4V8z"/>
          </svg>
        );
      case 'Manufacturing':
        return (
          <svg {...baseProps}>
            <path d="M3 21h18"/>
            <path d="M5 21v-7l5-3v10"/>
            <path d="M14 21v-6l5-3v9"/>
          </svg>
        );
      default:
        return (
          <svg {...baseProps}>
            <circle cx="12" cy="12" r="7"/>
            <path d="M12 9v6M9 12h6"/>
          </svg>
        );
    }
  };

  const pricingPlans = [
    {
      name: 'Essential',
      price: '₹5,000',
      description: 'Professional website without admin panel',
      features: [
        'Up to 5 pages',
        'Mobile responsive design',
        'Basic SEO setup',
        'Contact form',
        'Social media integration',
        '6 months support',
        'EMI options available'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Business',
      price: '₹10,000',
      description: 'Complete website with admin panel',
      features: [
        'Up to 15 pages',
        'Custom admin dashboard',
        'Content management system',
        'Advanced SEO setup',
        'Database integration',
        '1 year support',
        'Training included'
      ],
      popular: true,
      cta: 'Get Started'
    },
    {
      name: 'Enterprise',
      price: '₹20,000',
      description: 'Fully customized solution with advanced features',
      features: [
        'Unlimited pages',
        'Advanced SEO research & strategy',
        'Custom functionality',
        'Performance optimization',
        'E-commerce integration',
        '2 years support',
        'Priority service'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const servicesList = [
    'Web Design & Development',
    'E-Commerce Solutions',
    'SEO & Digital Marketing',
    'Content Management Systems',
    'Web App Development',
    'Maintenance & Support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header ref={headerRef} className="sticky top-0 z-50 bg-white/5 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20">
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold">
            <span className="text-white">Sitara</span>
            <span className="text-blue-400">Web</span>
            <span className="text-gray-400">.tech</span>
          </div>
          
          <nav className="hidden md:flex md:gap-3 lg:gap-5 xl:gap-7">
            {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="group relative pl-4 pr-2 py-1.5 rounded-xl text-gray-200 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 bg-white/0 hover:bg-white/10 backdrop-blur-sm backdrop-saturate-150 ring-1 ring-white/10 hover:ring-blue-400/30 shadow-sm hover:shadow-blue-900/20 text-sm md:text-sm lg:text-base"
              >
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                <span className="relative z-10 font-medium">{item}</span>
                <span className="pointer-events-none absolute left-1/2 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
                <span className="pointer-events-none absolute left-1/2 -bottom-1 h-1 w-0 bg-blue-500/30 blur-sm transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          <a href="#contact" className="hidden lg:inline-flex relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 md:px-6 py-2 rounded-xl shadow-lg shadow-blue-900/30 ring-1 ring-white/10 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 hover:shadow-blue-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50">
            <span className="relative z-10 font-semibold">Request Free Audit</span>
          </a>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            {/* backdrop */}
            <div 
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* panel */}
            <div className="absolute top-16 left-4 right-4 rounded-2xl bg-black/90 shadow-2xl p-4">
              <nav className="flex flex-col divide-y divide-white/10">
              {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                    className="px-3 py-3 text-lg font-medium text-gray-200 hover:text-white rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
                <div className="pt-4">
              <a 
                href="#contact" 
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                    Request Free Audit
              </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        id="home"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className={`relative overflow-hidden py-20 md:py-32 scroll-mt-24 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Vignette overlay for cinematic depth */}
        <div ref={vignetteRef} className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.6)_90%)]" />
        {/* Decorative background orbs with motion */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div ref={orb1Ref} className="absolute -top-24 -left-24 will-change-transform">
            <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 blur-3xl animate-float" />
          </div>
          <div ref={orb2Ref} className="absolute top-32 -right-24 will-change-transform">
            <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-600/30 blur-3xl animate-float-slow" />
          </div>
          <div ref={orb3Ref} className="absolute bottom-0 left-1/2 -translate-x-1/2 will-change-transform">
            <div className="h-56 w-[40rem] bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 blur-2xl" />
          </div>
        </div>

        {/* Subtle grid lines */}
        <div ref={gridRef} className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [mask-image:radial-gradient(closest-side,black,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <div data-hide-on-scroll className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-white/15 hover:ring-blue-300/30">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-200">Premium Web Solutions</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span ref={titleWrapRef} className="inline-block will-change-transform">
                <span ref={titleRef} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.25)] gradient-animate transition-transform duration-150 ease-out">
                  Accelerate Your Digital Growth
                </span>
              </span>
            </h1>
            <p data-hide-on-scroll className="text-lg md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your online presence with high-performance design, conversion-focused UX, and blazing-fast technology.
            </p>

            <div data-hide-on-scroll className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA with animated glow and rotating gradient ring */}
              <a href="#pricing" className="btn-hero group relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 font-semibold animate-glow text-center">
                <span className="relative z-10">Explore Plans</span>
                {/* rotating gradient ring */}
                <span className="pointer-events-none absolute -inset-1 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity">
                  <span className="absolute -inset-[2px] rounded-[20px] bg-[conic-gradient(var(--tw-gradient-stops))] from-blue-400 via-indigo-400 to-blue-400 blur-sm spin-slow" />
                </span>
                {/* inner overlay for readability */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent" />
                {/* shine sweep */}
                <span className="shine-sweep pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-white/25 blur-lg" />
              </a>

              {/* Secondary CTA with animated border and shine */}
              <a href="#industries" className="btn-hero-secondary group relative overflow-hidden bg-white/5 text-blue-200 border border-white/15 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md font-semibold">
                <span className="relative z-10">Get Free Industry Analysis</span>
                <span className="block text-xs text-blue-300/70 mt-1 relative z-10 group-hover:text-blue-200/90">Personalized insights for your niche</span>
                {/* animated gradient border glow */}
                <span className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.15),rgba(99,102,241,0.15),rgba(59,130,246,0.15))] opacity-40 group-hover:opacity-60 transition-opacity" />
                {/* shine sweep */}
                <span className="shine-sweep pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-white/15 blur-lg" />
              </a>
            </div>

            <div data-hide-on-scroll className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="group relative rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm shimmer-border transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="text-blue-300 font-semibold">2.5x</div>
                <div className="text-gray-400 text-sm">Faster growth after redesign</div>
            </div>
              <div className="group relative rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm shimmer-border transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="text-blue-300 font-semibold">3x</div>
                <div className="text-gray-400 text-sm">Average increase in revenue</div>
            </div>
              <div className="group relative rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm shimmer-border transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]">
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="text-blue-300 font-semibold">24/7</div>
                <div className="text-gray-400 text-sm">Visibility and lead generation</div>
            </div>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="relative overflow-hidden py-28 md:py-32 bg-gray-900/50 scroll-mt-24">
        {/* Ambient accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700/30 to-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-16 left-1/5 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-700/25 to-pink-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">
            Why Your Business Needs A Website
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            In today's digital age, your website is your storefront, your salesperson, and your brand ambassador — working 24/7 to grow your business.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="service-card group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/20">
              <span className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] opacity-30 group-hover:opacity-50 transition-opacity spin-slow" />
              <div className="relative">
              <h3 className="text-xl font-bold mb-4 text-white">Digital Storefront Always Open</h3>
              <p className="text-gray-300 mb-4">
                  Your website works 24/7/365, attracting customers even while you sleep. Businesses report up to 40% more leads after launch.
                </p>
                <ul className="space-y-2 text-gray-300/90">
                  {[
                    'Reach customers beyond your geographical location',
                    'Showcase your products/services 24/7',
                    'Generate leads even outside business hours'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-600/30 text-blue-300 ring-1 ring-blue-400/30">✓</span>
                      <span>{text}</span>
                </li>
                  ))}
              </ul>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="service-card group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/20">
              <span className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] opacity-30 group-hover:opacity-50 transition-opacity spin-slow" />
              <div className="relative">
              <h3 className="text-xl font-bold mb-4 text-white">Credibility & Trust Building</h3>
              <p className="text-gray-300 mb-4">
                  75% of consumers judge a company's credibility by its website. Make a stunning first impression.
                </p>
                <ul className="space-y-2 text-gray-300/90">
                  {[
                    'Professional appearance builds customer trust',
                    'Showcase testimonials and success stories',
                    'Establish authority in your industry'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-600/30 text-blue-300 ring-1 ring-blue-400/30">✓</span>
                      <span>{text}</span>
                </li>
                  ))}
              </ul>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="service-card group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/20">
              <span className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] opacity-30 group-hover:opacity-50 transition-opacity spin-slow" />
              <div className="relative">
              <h3 className="text-xl font-bold mb-4 text-white">Marketing & Growth Engine</h3>
              <p className="text-gray-300 mb-4">
                  Your website anchors all marketing. Many brands see 3x ROI after optimization.
                </p>
                <ul className="space-y-2 text-gray-300/90">
                  {[
                    'SEO brings free, targeted traffic',
                    'Email marketing integration captures leads',
                    'Social media integration expands your reach'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-600/30 text-blue-300 ring-1 ring-blue-400/30">✓</span>
                      <span>{text}</span>
                </li>
                  ))}
              </ul>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="service-card group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/20">
              <span className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] opacity-30 group-hover:opacity-50 transition-opacity spin-slow" />
              <div className="relative">
              <h3 className="text-xl font-bold mb-4 text-white">Sales & Conversion Machine</h3>
              <p className="text-gray-300 mb-4">
                  Optimized sites drive sales: e‑commerce up to 200%, services +60% conversions.
                </p>
                <ul className="space-y-2 text-gray-300/90">
                  {[
                    'Direct sales through e‑commerce integration',
                    'Lead capture for service businesses',
                    'Appointment booking and scheduling'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-3 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-600/30 text-blue-300 ring-1 ring-blue-400/30">✓</span>
                      <span>{text}</span>
                </li>
                  ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative overflow-hidden py-24 scroll-mt-24">
        {/* Ambient glow accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700/25 to-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-600/20 to-purple-600/25 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">Investment in Growth, Not Expense</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Our clients typically see 3-5x return on their website investment within the first year
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card group relative overflow-visible rounded-2xl p-8 backdrop-blur-md border ${plan.popular ? 'border-blue-400/40' : 'border-white/10'} bg-white/5 transition-all duration-300 hover:-translate-y-2`}>
                {/* animated border glow */}
                <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity">
                  <span className={`absolute -inset-[2px] rounded-[20px] blur-sm ${plan.popular ? 'bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.35),rgba(99,102,241,0.35),rgba(59,130,246,0.35))]' : 'bg-[conic-gradient(from_90deg_at_50%_50%,rgba(148,163,184,0.2),rgba(100,116,139,0.2),rgba(148,163,184,0.2))]'} spin-slow`} />
                </span>

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide shadow z-10 whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="text-4xl font-extrabold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">{plan.price}</span>
                </div>
                <p className="text-gray-300/90 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-200">
                      <span className="mr-3 inline-flex h-5 w-5 items-center justify-center rounded-md bg-green-600/25 text-green-300 ring-1 ring-green-400/30">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact" 
                  className={`relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl py-3 font-semibold ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500' : 'bg-white/10 text-white hover:bg-white/15'}`}
                >
                  <span className="relative z-10">{plan.cta}</span>
                  <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-4 text-white">Not Sure Which Plan You Need?</h3>
            <p className="text-gray-300 mb-6">
              Get a FREE personalized recommendation based on your business type, goals, and budget
            </p>
            <a href="#industries" className="relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all font-medium ring-1 ring-white/10">
              Get Free Recommendation
            </a>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative overflow-hidden py-24 bg-gray-900/50 scroll-mt-24">
        {/* Ambient accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-24 left-1/5 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700/25 to-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/6 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-700/25 to-pink-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">Get FREE Customized Research For Your Industry</h2>
          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">
            Discover how a professional website can transform your specific business
          </p>
          <p className="text-center text-blue-300 font-medium mb-12">
            Click your industry to get FREE customized research and strategy
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {businessCategories.map((category, index) => {
                const accent = getIndustryAccent(category.name);
                return (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className={`industry-card group relative overflow-hidden rounded-2xl text-center will-change-transform transition-transform duration-300 hover:-translate-y-1 border-0 bg-white/5 backdrop-blur-md transition-shadow`}
                  style={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 28px 120px ${accent.shadow}, inset 0 0 0 1px ${accent.from}55`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'; }}
                >
                  {/* animated gradient border ring on edges */}
                  <span className="gradient-border rounded-2xl" style={{ background: `conic-gradient(from 90deg at 50% 50%, ${accent.from}, ${accent.to}, ${accent.from})`, padding: '1px' }} />

                  {/* subtle diagonal pattern */}
                  <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,rgba(255,255,255,0.8)_8%,transparent_8%)] bg-[length:10px_10px]" />

                  {/* corner glow orbs */}
                  <span className="pointer-events-none absolute -top-6 -left-6 h-16 w-16 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity" style={{ backgroundColor: accent.from + '33' }} />
                  <span className="pointer-events-none absolute -bottom-6 -right-6 h-16 w-16 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity" style={{ backgroundColor: accent.to + '33' }} />

                  {/* header ribbon */}
                  <div className="relative z-10 px-4 pt-5 pb-2 transition-transform duration-300 group-hover:scale-[1.02]">
                    <div className="mx-auto h-10 w-10 md:h-12 md:w-12 grid place-items-center rounded-xl text-xl" style={{ background: `linear-gradient(to bottom right, ${accent.from}33, ${accent.to}33)` }}>
                      <span className="text-white/90">{renderIndustryIcon(category.name)}</span>
                  </div>
                    <div className="mt-2 text-[13px] md:text-sm font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}>{category.name}</div>
                    <p className="mt-1 text-[11px] text-gray-300/80">
                      {(category.impact && category.impact.split('.')) ? category.impact.split('.')[0] : ''}
                    </p>
                  </div>

                  {/* footer callout bar */}
                  <div className="relative z-10 px-3 pb-4">
                    <div className="mx-auto max-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-white/5 text-[11px] py-1.5 group-hover:bg-white/10 transition-colors" style={{ color: accent.to }}>
                    FREE Research
                  </div>
                  </div>

                  {/* hover shine sweep */}
                  <span className="pointer-events-none absolute top-0 -left-1/3 h-full w-0 opacity-0 group-hover:opacity-100 group-hover:w-[160%] -skew-x-12 transition-all duration-500" style={{ background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}22)` }} />
                </button>
              );})}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-6">
                We've helped businesses across all industries increase revenue, credibility, and customer engagement through strategic website development.
              </p>
              <a href="#contact" className="relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all font-medium ring-1 ring-white/10">
                Get Your FREE Industry Report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative overflow-hidden py-24 scroll-mt-24">
        {/* Ambient accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-24 left-1/6 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700/25 to-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-600/20 to-purple-600/25 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">Ready to Transform Your Business?</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Get a FREE website audit and customized proposal tailored to your business needs
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Left: benefits card */}
            <div className="contact-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_24px_80px_rgba(59,130,246,0.25)]">
              <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity">
                <span className="absolute -inset-[2px] rounded-[20px] blur-sm bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.22),rgba(99,102,241,0.22),rgba(59,130,246,0.22))] spin-slow" />
              </span>
              <span className="pointer-events-none absolute -inset-10 rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">Why Choose SitaraWeb.tech?</h3>
              <div className="space-y-5">
                {[
                  { t: 'Industry-Specific Solutions', s: 'Websites tailored to your business and customers' },
                  { t: 'ROI-Focused Development', s: 'Every element designed to increase conversions' },
                  { t: 'Ongoing Optimization', s: 'Continuous improvements to keep you ahead' },
                ].map((item, i) => (
                  <div key={i} className="group flex items-start">
                    <div className="w-10 h-10 rounded-lg mr-4 grid place-items-center text-blue-300 ring-1 ring-white/10 bg-white/5 group-hover:bg-white/10 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                      <h4 className="font-semibold text-white">{item.t}</h4>
                      <p className="text-gray-400 text-sm">{item.s}</p>
                  </div>
                </div>
                ))}
                  </div>
              <div className="mt-6 text-sm text-gray-400">Average response time: under 24 hours</div>
                </div>
                
            {/* Right: form */}
            <div className="contact-reveal group">
              {isSubmitted ? (
                <div className="bg-green-900/30 border border-green-800 p-8 rounded-2xl text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                  <p className="text-gray-300">Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_24px_80px_rgba(99,102,241,0.25)]">
                  <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-20 group-hover:opacity-50 transition-opacity">
                    <span className="absolute -inset-[2px] rounded-[20px] blur-sm bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] spin-slow" />
                  </span>
                  <span className="pointer-events-none absolute -inset-10 rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.16),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium text-white">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400 transition-shadow shadow-[0_0_0_rgba(0,0,0,0)] focus:shadow-[0_10px_40px_rgba(59,130,246,0.2)]"
                        placeholder="Your full name"
                      />
                      {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 font-medium text-white">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400 transition-shadow shadow-[0_0_0_rgba(0,0,0,0)] focus:shadow-[0_10px_40px_rgba(59,130,246,0.2)]"
                        placeholder="Your email address"
                      />
                      {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="company" className="block mb-2 font-medium text-white">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400 transition-shadow shadow-[0_0_0_rgba(0,0,0,0)] focus:shadow-[0_10px_40px_rgba(59,130,246,0.2)]"
                      placeholder="Your company name"
                    />
                    {formErrors.company && <p className="text-red-400 text-sm mt-1">{formErrors.company}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="budget" className="block mb-2 font-medium text-white">Project Budget</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white'
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select budget range</option>
                        <option value="5k-10k" style={{ backgroundColor: '#1f2937', color: 'white' }}>₹5,000 - ₹10,000</option>
                        <option value="10k-20k" style={{ backgroundColor: '#1f2937', color: 'white' }}>₹10,000 - ₹20,000</option>
                        <option value="20k-50k" style={{ backgroundColor: '#1f2937', color: 'white' }}>₹20,000 - ₹50,000</option>
                        <option value="50k+" style={{ backgroundColor: '#1f2937', color: 'white' }}>₹50,000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timeline" className="block mb-2 font-medium text-white">Project Timeline</label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white'
                        }}
                      >
                        <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select timeline</option>
                        <option value="2 weeks" style={{ backgroundColor: '#1f2937', color: 'white' }}>2 weeks</option>
                        <option value="1 month" style={{ backgroundColor: '#1f2937', color: 'white' }}>1 month</option>
                        <option value="2 months" style={{ backgroundColor: '#1f2937', color: 'white' }}>2 months</option>
                        <option value="3+ months" style={{ backgroundColor: '#1f2937', color: 'white' }}>3+ months</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium text-white">Services Needed</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {servicesList.map((service, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`service-${index}`}
                            name="services"
                            value={service}
                            checked={formData.services.includes(service)}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`service-${index}`} className="ml-2 text-sm text-gray-300">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 font-medium text-white">Project Details *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400 transition-shadow shadow-[0_0_0_rgba(0,0,0,0)] focus:shadow-[0_10px_40px_rgba(59,130,246,0.2)]"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                    {formErrors.message && <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  
                  {formErrors.submit && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                      <p className="text-red-400 text-sm">{formErrors.submit}</p>
                    </div>
                  )}
                  
                  <button type="submit" className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl py-4 font-semibold ring-1 ring-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500">
                    <span className="relative z-10">Get FREE Website Audit</span>
                    <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-black/90 text-white border-t border-white/10">
        {/* Ambient accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-24 left-1/6 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-700/25 to-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-600/20 to-purple-600/25 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-5 lg:px-6 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Brand */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6">
              <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-20">
                <span className="absolute -inset-[2px] rounded-[20px] blur-sm bg-[conic-gradient(from_90deg_at_50%_50%,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(59,130,246,0.18))] spin-slow" />
              </span>
              <div className="text-xl sm:text-2xl font-extrabold mb-3">
                <span className="text-white">Sitara</span>
                <span className="text-blue-400">Web</span>
                <span className="text-gray-400">.tech</span>
              </div>
              <p className="text-gray-300/90">Premium web solutions powered by cutting-edge technology.</p>
              <p className="mt-2 text-gray-400">Noida, Uttar Pradesh, India</p>
            </div>
            
            {/* Links */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="group inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <span className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-60 group-hover:opacity-100" />
                    <span className="text-sm">{item}</span>
                  </a>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white mb-2">Get in touch</h4>
                <p className="text-gray-400 text-sm">hello@sitaraweb.tech</p>
                <p className="text-gray-400 text-sm">+91-9876543210</p>
              </div>
            </div>
            
            {/* Newsletter / Social */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                <input type="email" placeholder="Your email" className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 ring-1 ring-white/10 hover:from-blue-500 hover:to-indigo-500 transition-colors">Subscribe</button>
              </form>
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                {[
                  { href: 'https://www.linkedin.com/company/sitaraweb-tech/', label: 'LinkedIn', svg: (<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>) },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="group w-10 h-10 rounded-lg grid place-items-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-white/90" fill="currentColor" viewBox="0 0 24 24">{s.svg}</svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 text-center text-gray-400">
            <p className="text-sm">&copy; {new Date().getFullYear()} SitaraWeb.tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}