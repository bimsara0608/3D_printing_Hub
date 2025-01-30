// src/components/ThreeDViewer/ThreeDViewer.js

import  { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface ThreeDViewerProps {
  fileUrl: string;
}

const ThreeDViewer = ({ fileUrl }: ThreeDViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      setError("Mount reference not found.");
      return;
    }

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light gray background

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100); // Set a default position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Determine the loader based on file extension
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase() || '';
    let loader;
    if (fileExtension === 'stl') {
      loader = new STLLoader();
    } else if (fileExtension === 'obj') {
      // Uncomment if supporting .obj files in the future
      // loader = new OBJLoader();
      setError(`Loading .obj files is not supported yet.`);
      return;
    } else {
      setError(`Unsupported file format: .${fileExtension}`);
      return;
    }

    // Load the 3D model
    loader.load(
      fileUrl,
      (loadedObject: any) => {
        let mesh;
        if (fileExtension === 'stl') {
          const material = new THREE.MeshStandardMaterial({ color: 0x2194ce });
          mesh = new THREE.Mesh(loadedObject, material);
        } else if (fileExtension === 'obj') {
          // For OBJLoader, loadedObject is an Object3D
          // Uncomment and implement if supporting .obj files
          /*
          loadedObject.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x2194ce });
            }
          });
          mesh = loadedObject;
          */
        }

        if (mesh) {
          scene.add(mesh);
        } else {
          setError("Failed to create mesh.");
        }

        // Center and scale the model
        if (mesh) {
          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3());
          mesh.position.sub(center); // Center the model

          const size = box.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          const scaleFactor = 50 / maxDimension; // Adjust scaling factor as needed
          mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        } else {
          setError("Failed to create mesh.");
        }

        // Position the camera based on the model size
        if (mesh) {
          const box = new THREE.Box3().setFromObject(mesh);
          const size = box.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          const scaleFactor = 50 / maxDimension; // Adjust scaling factor as needed
          camera.position.set(0, 0, maxDimension * scaleFactor * 2);
          camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.update();

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },
      (xhr: { loaded: number; total: number; }) => {
        // Optional: Handle progress events
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
      },
      (err: any) => {
        console.error("Error loading 3D model:", err);
        setError("Failed to load the 3D model.");
      }
    );

    // Handle window resizing
    const handleResize = () => {
      if (mount) {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose(); // Properly dispose of the renderer

      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [fileUrl]);

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "400px", backgroundColor: "#f0f0f0" }}
    />
  );
};

export default ThreeDViewer;
