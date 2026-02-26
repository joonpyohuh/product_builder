import { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CupModel = ({ scrollProgress }: { scrollProgress: { value: number } }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation based on scroll
      meshRef.current.rotation.y = scrollProgress.value * Math.PI * 4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + (scrollProgress.value * 0.5);
      
      // Position shift
      const targetX = scrollProgress.value < 0.3 ? 0 : scrollProgress.value < 0.6 ? -2 : 2;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Cup Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 0.8, 2.5, 32]} />
        <meshPhysicalMaterial 
          color="#f5f5f7" 
          roughness={0.1} 
          metalness={0.1}
          transmission={0.1}
          thickness={0.5}
        />
      </mesh>
      {/* Cup Handle */}
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
        <meshPhysicalMaterial color="#f5f5f7" roughness={0.1} />
      </mesh>
      {/* Top Rim */}
      <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.05, 16, 32]} />
        <meshPhysicalMaterial color="#e8e8ed" roughness={0.1} />
      </mesh>
    </group>
  );
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef({ value: 0 });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current.value = self.progress;
        }
      });

      // Animate text sections
      gsap.utils.toArray<HTMLElement>('.text-reveal').forEach((elem) => {
        gsap.fromTo(elem, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
              trigger: elem,
              start: "top 80%",
              end: "top 50%",
              scrub: true,
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ background: '#fafafa' }}>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', padding: '1rem 5%', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Opal Cup</div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.9rem' }}>Overview</a>
          <a href="#" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.9rem' }}>Specs</a>
          <button style={{ 
            background: '#0071e3', color: 'white', border: 'none', 
            padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            Buy Now <ShoppingBag size={16} />
          </button>
        </div>
      </nav>

      <div className="canvas-container">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <CupModel scrollProgress={scrollProgress.current} />
          </Float>
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </Canvas>
      </div>

      <section className="hero">
        <div className="text-reveal">
          <h1>Perfectly Balanced.</h1>
          <p>The new Opal Cup defines modern elegance.</p>
        </div>
      </section>

      <section className="content-right">
        <div className="text-box text-reveal glass">
          <h2>Precision in every sip.</h2>
          <p>Crafted from premium borosilicate glass and reinforced with a proprietary Opal coating, it maintains your beverage's temperature while remaining cool to the touch.</p>
        </div>
      </section>

      <section className="content-left">
        <div className="text-box text-reveal glass">
          <h2>Designed for life.</h2>
          <p>The ergonomic handle is sculpted to fit the natural curve of your hand, providing a secure and comfortable grip for every occasion.</p>
        </div>
      </section>

      <section className="hero">
        <div className="text-reveal">
          <h2>Experience Opal.</h2>
          <p style={{ marginBottom: '2rem' }}>Available in Arctic White, Space Gray, and Deep Sea.</p>
          <a href="#" style={{ color: '#0071e3', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            Learn more <ChevronRight size={20} />
          </a>
        </div>
      </section>

      <footer style={{ padding: '4rem 10%', background: '#f5f5f7', textAlign: 'center', color: '#86868b', fontSize: '0.9rem' }}>
        <p>© 2026 Opal Design. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
