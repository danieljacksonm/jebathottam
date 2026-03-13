"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const ACCENT_COLOR = 0x10b981;
const ACCENT_LIGHT = 0x34d399;

export default function HeroThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0c1222, 0);
    container.appendChild(renderer.domElement);

    // Soft gradient sphere (main blob)
    const sphereGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: ACCENT_COLOR,
      emissive: ACCENT_COLOR,
      emissiveIntensity: 0.15,
      shininess: 8,
      transparent: true,
      opacity: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Second smaller orb
    const orbGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const orbMat = new THREE.MeshPhongMaterial({
      color: ACCENT_LIGHT,
      emissive: ACCENT_LIGHT,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.4,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(2, 1.2, -2);
    scene.add(orb);

    // Ambient + point lights
    scene.add(new THREE.AmbientLight(0x94a3b8, 0.4));
    const pointLight = new THREE.PointLight(0xf1f5f9, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(ACCENT_LIGHT, 0.4);
    pointLight2.position.set(-4, -2, 3);
    scene.add(pointLight2);

    // Floating particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: ACCENT_LIGHT,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    let frameId: number;
    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();
      sphere.rotation.y = t * 0.15;
      sphere.rotation.x = t * 0.08;
      orb.rotation.y = t * 0.2;
      orb.position.x = 2 + Math.sin(t * 0.5) * 0.3;
      orb.position.y = 1.2 + Math.cos(t * 0.4) * 0.2;
      particles.rotation.y = t * 0.05;
      particles.rotation.x = t * 0.03;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    />
  );
}
