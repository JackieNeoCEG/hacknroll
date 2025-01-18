import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    let mixer;

    const loader = new GLTFLoader();
    loader.load(
      '/dragon.glb',
      (gltf) => {
        console.log('Model loaded:', gltf);
        const model = gltf.scene;
        
        // Adjust scale (make these values smaller or larger as needed)
        model.scale.set(0.2, 0.2, 0.2); // Reduced scale to 20% of original size
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Optionally adjust the vertical position
        model.position.y -= 1; // Move down by 1 unit
        
        scene.add(model);

        // Setup animation
        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }

        // Automatically position camera to frame the model
        const boundingBox = new THREE.Box3().setFromObject(model);
        const size = boundingBox.getSize(new THREE.Vector3());
        const distance = Math.max(size.x, size.y, size.z) * 2; // Adjust multiplier as needed
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;
