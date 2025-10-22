import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import About from './About';
import Contact from './Contact';
import { BusPicture } from '../../assets';
import styles from './Home.module.css';
import { useInView } from 'react-intersection-observer';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import PublicRoutes from './PublicRoutes';
import PublicSchedule from './PublicSchedule';

const AnimatedSection = ({ children, id }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div
            id={id}
            ref={ref}
            className={`transition-all duration-1000 ease-in-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3 rounded-full text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <ArrowUpIcon className="h-6 w-6" />
        </button>
    );
};

export default function Home() {
    return (
        <div>
            <div 
                id="home" 
                className={`${styles.heroContainer} ${styles.heroBackground}`}
                style={{ backgroundImage: `url(${BusPicture})` }}>
                <div className={styles.overlay}></div>
                <div className={`${styles.heroFlex} animate-fade-in-up`}>
                    <div>
                        <h1 className={styles.heroTitle}>UrbanSync</h1>
                        <p className={styles.heroSubtitle}>Smart Urban Transport Management System</p>
                    </div>
                    <div className={styles.heroDescription}>
                        <p>UrbanSync is a comprehensive mobile and web-based platform</p>
                        <p>designed to monitor and manage bus transportation systems across Quezon City,</p>
                        <p>enhancing route tracking, scheduling, and commuter convenience.</p>
                    </div>
                
                </div>
            </div>
            <AnimatedSection id="routes">
                <PublicRoutes />
            </AnimatedSection>
            <AnimatedSection id="schedule">
                <PublicSchedule />
            </AnimatedSection>
            <AnimatedSection id="about">
                <About />
            </AnimatedSection>
            <AnimatedSection id="contact">
                <Contact />
            </AnimatedSection>
            <BackToTopButton />
        </div>
    );
}
