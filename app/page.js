'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
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
      }, 3000);
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
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-white">Sitara</span>
            <span className="text-blue-400">Web</span>
            <span className="text-gray-400">.tech</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-400 transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <a href="#contact" className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
            Get a free audit
          </a>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 py-4 px-4 absolute w-full border-b border-gray-800 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-center hover:bg-blue-700 transition-all mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Get a free audit
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        id="home"
        className={`py-20 md:py-32 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="bg-blue-900/30 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                Premium Web Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Your Digital Presence <span className="text-white">=</span> Your Business Growth
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
              Businesses with professional websites grow 2.5x faster and generate 3x more revenue
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#pricing" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-medium">
                View Pricing Plans
              </a>
              <a href="#industries" className="bg-transparent border border-blue-500 text-blue-400 px-8 py-4 rounded-lg hover:bg-blue-500 hover:text-black transition-all font-medium">
                Get Free Industry Analysis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-black/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">2.5x</div>
              <div className="text-gray-300">Faster Business Growth</div>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">3x</div>
              <div className="text-gray-300">More Revenue</div>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">70%</div>
              <div className="text-gray-300">More Credibility</div>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Business Visibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Your Business Needs A Website</h2>
          <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            {"In today's digital age, your website is your storefront, your salesperson, and your brand ambassador - all working together 24/7 to grow your business"}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-white">Digital Storefront Always Open</h3>
              <p className="text-gray-300 mb-4">
                Your website works 24/7/365, attracting customers even while you sleep. Businesses with websites report 40% more leads after launch.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reach customers beyond your geographical location
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Showcase your products/services 24/7
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generate leads even outside business hours
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-white">Credibility & Trust Building</h3>
              <p className="text-gray-300 mb-4">
               {" 75% of consumers admit to making judgments about a company's credibility based on their website design."}
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional appearance builds customer trust
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Showcase testimonials and success stories
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Establish authority in your industry
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-white">Marketing & Growth Engine</h3>
              <p className="text-gray-300 mb-4">
                Websites are the foundation of all digital marketing efforts, with businesses seeing 3x ROI on marketing spend with a optimized site.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SEO brings free, targeted traffic to your business
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email marketing integration captures leads
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Social media integration expands your reach
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-white">Sales & Conversion Machine</h3>
              <p className="text-gray-300 mb-4">
                E-commerce businesses report 200% increase in sales after website optimization. Even service businesses see 60% more conversions.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Direct sales through e-commerce integration
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lead capture forms for service businesses
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Appointment booking and consultation scheduling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Investment in Growth, Not Expense</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Our clients typically see 3-5x return on their website investment within the first year
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-gradient-to-b ${plan.popular ? 'from-blue-900/30 to-blue-800/20 border-blue-500' : 'from-gray-800/50 to-gray-900/30 border-gray-700'} p-8 rounded-xl border transition-all transform hover:scale-105 backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4 text-blue-400">{plan.price}</div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact" 
                  className={`block text-center py-3 rounded-lg font-semibold ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'} transition-all`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-gray-800/30 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-white">Not Sure Which Plan You Need?</h3>
            <p className="text-gray-300 mb-6">
              Get a FREE personalized recommendation based on your business type, goals, and budget
            </p>
            <a href="#industries" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium">
              Get Free Recommendation
            </a>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Get FREE Customized Research For Your Industry</h2>
          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">
            Discover how a professional website can transform your specific business
          </p>
          <p className="text-center text-blue-400 font-medium mb-12">
            Click your industry to get FREE customized research and strategy
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {businessCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className={`group relative py-5 px-4 rounded-xl border text-center transition-all transform hover:scale-105 ${selectedCategory === category.name ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-blue-400 bg-gray-800/50'} backdrop-blur-sm overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform relative z-10">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium relative z-10">{category.name}</span>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    FREE Research
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-6">=
                {"We've helped businesses across all industries increase revenue, credibility, and customer engagement through strategic website development."}
              </p>
              <a href="#contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium">
                Get Your FREE Industry Report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ready to Transform Your Business?</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Get a FREE website audit and customized proposal tailored to your business needs
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Why Choose SitaraWeb.tech?</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg mr-4 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Industry-Specific Solutions</h4>
                    <p className="text-gray-400">Websites tailored to your specific business needs and customer expectations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg mr-4 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">ROI-Focused Development</h4>
                    <p className="text-gray-400">Every element designed to increase conversions and business growth</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg mr-4 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Ongoing Support & Optimization</h4>
                    <p className="text-gray-400">Continuous improvements to keep your website effective and up-to-date</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              {isSubmitted ? (
                <div className="bg-green-900/30 border border-green-800 p-8 rounded-xl text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                  <p className="text-gray-300">{"Your message has been sent successfully. We'll get back to you shortly."}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium text-white">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      >
                        <option value="">Select budget range</option>
                        <option value="5k-10k">₹5,000 - ₹10,000</option>
                        <option value="10k-20k">₹10,000 - ₹20,000</option>
                        <option value="20k-50k">₹20,000 - ₹50,000</option>
                        <option value="50k+">₹50,000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="timeline" className="block mb-2 font-medium text-white">Project Timeline</label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      >
                        <option value="">Select timeline</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2 months">2 months</option>
                        <option value="3+ months">3+ months</option>
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
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
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
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                    {formErrors.message && <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>}
                  </div>
                  
                  <button type="submit" className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold">
                    Get FREE Website Audit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">Sitara</span>
                <span className="text-blue-400">Web</span>
                <span className="text-gray-400">.tech</span>
              </div>
              <p className="text-gray-400 mb-4">Premium web solutions powered by cutting-edge technology</p>
              <p className="text-gray-400">Noida, Uttar Pradesh, India</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Services', 'Pricing', 'Industries', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Connect With Us</h3>
              <div className="space-y-2 text-gray-400">
                <p>hello@sitaraweb.tech</p>
                <p>+91-9876543210</p>
                <div className="flex space-x-4 mt-4">
                  <a 
                    href="https://www.linkedin.com/company/sitaraweb-tech/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SitaraWeb.tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}