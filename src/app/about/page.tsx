'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Award, Clock, Globe, Heart, Target, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const teamMembers = [
  {
    name: 'Aung Thura',
    role: 'Founder & CEO',
    image: '👨‍💼',
    description: 'Leading the vision for secure internet access in Myanmar'
  },
  {
    name: 'Thida Soe',
    role: 'Technical Director',
    image: '👩‍💻',
    description: 'Ensuring top-notch security and performance'
  },
  {
    name: 'Min Khant',
    role: 'Customer Success',
    image: '👨‍🎓',
    description: 'Dedicated to providing excellent customer support'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize your privacy and security above everything else'
  },
  {
    icon: Heart,
    title: 'Customer Care',
    description: '24/7 support to ensure you have the best VPN experience'
  },
  {
    icon: Target,
    title: 'Quality Service',
    description: 'Only premium VPN accounts from trusted providers'
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Get your VPN keys instantly after payment verification'
  }
];

const stats = [
  { number: '5000+', label: 'Happy Customers' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' },
  { number: '3+', label: 'Years Experience' }
];

export default function AboutPage() {
  const [aboutUsText, setAboutUsText] = useState('Myanmar\'s trusted VPN marketplace, providing secure internet access to thousands of users since 2021');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.settings && data.settings.aboutUsText) {
            setAboutUsText(data.settings.aboutUsText);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              About <span className="text-neon-cyan">Kage VPN Store</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {aboutUsText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
                Our <span className="text-neon-cyan">Story</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in 2021, Kage VPN Store emerged from a simple need: 
                  providing reliable and affordable VPN access to Myanmar users 
                  who value their online privacy and security.
                </p>
                <p>
                  What started as a small initiative has grown into Myanmar's 
                  most trusted VPN marketplace, serving thousands of customers 
                  with premium VPN accounts from leading providers like ExpressVPN, 
                  NordVPN, and Surfshark.
                </p>
                <p>
                  We believe that everyone deserves secure and unrestricted 
                  internet access, and we're committed to making that a reality 
                  for our customers.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 rounded-2xl p-8 backdrop-blur-sm border border-neon-cyan/20">
                <Globe className="h-24 w-24 text-neon-cyan mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-center mb-4">
                  Connecting Myanmar to the World
                </h3>
                <p className="text-gray-300 text-center">
                  Bridging the gap between local needs and global internet freedom
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-primary-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our <span className="text-neon-cyan">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary hover:border-neon-cyan/50 transition-colors"
              >
                <value.icon className="h-12 w-12 text-neon-cyan mb-4" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Meet Our <span className="text-neon-cyan">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate people behind Kage VPN Store
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-secondary/50 rounded-xl p-8 text-center border border-primary-secondary hover:border-neon-cyan/50 transition-colors"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <div className="text-neon-cyan font-medium mb-4">{member.role}</div>
                <p className="text-gray-300">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-8">
              Our <span className="text-neon-cyan">Mission</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                "To democratize internet freedom by providing Myanmar users with 
                reliable, affordable, and secure VPN solutions that protect their 
                privacy and enable unrestricted access to global information."
              </p>
              <div className="flex justify-center">
                <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-full p-4">
                  <Award className="h-12 w-12 text-neon-cyan" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}