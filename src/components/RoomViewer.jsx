import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function RoomViewer({ modelUrl }) {
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!modelUrl) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f7);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 15;
        controls.minDistance = 2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const fillLight = new THREE.PointLight(0xffffff, 0.5);
        fillLight.position.set(-5, 2, -5);
        scene.add(fillLight);

        // Room setup (A simple square room floor)
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Grid helper for better spatial feeling
        const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xeeeeee);
        scene.add(gridHelper);

        // Walls (subtle wireframe or semi-transparent)
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.1,
            side: THREE.BackSide
        });
        const roomBox = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 10), wallMaterial);
        roomBox.position.y = 2.5;
        scene.add(roomBox);

        // Model Loading
        const loader = new GLTFLoader();
        loader.load(
            modelUrl,
            (gltf) => {
                const model = gltf.scene;
                
                // Center and scale model
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                // Reset model position to floor
                model.position.x += (model.position.x - center.x);
                model.position.z += (model.position.z - center.z);
                model.position.y += (model.position.y - box.min.y);

                // Auto scale if too big/small
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 5) {
                    const scale = 4 / maxDim;
                    model.scale.set(scale, scale, scale);
                }

                model.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                scene.add(model);
                setLoading(false);
                
                // Adjust camera to view model
                const boxAfterScale = new THREE.Box3().setFromObject(model);
                const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());
                camera.lookAt(centerAfterScale);
                controls.target.copy(centerAfterScale);
            },
            (xhr) => {
                // Progress
            },
            (err) => {
                console.error('Error loading GLB:', err);
                setError('Failed to load 3D model.');
                setLoading(false);
            }
        );

        // Animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            scene.traverse(object => {
                if (object.isMesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, [modelUrl]);

    return (
        <div className="room-viewer-container" ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {loading && (
                <div className="viewer-overlay">
                    <div className="spinner"></div>
                    <p>Đang tải mô hình 3D...</p>
                </div>
            )}
            {error && (
                <div className="viewer-overlay error">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
