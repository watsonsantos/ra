"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Add AR button
    document.body.appendChild(ARButton.createButton(renderer));

    // Create image plane
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(1 * aspectRatio, 1);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Position the plane
        plane.position.z = -2;
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the texture:", error);
      }
    );

    // Position the camera
    camera.position.z = 2;

    // Animation loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null);
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl]);

  return (
    <Suspense>
      <div ref={containerRef} className="w-full h-screen" />
    </Suspense>
  );
}
