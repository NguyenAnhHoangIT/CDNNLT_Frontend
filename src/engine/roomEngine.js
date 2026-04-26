import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/**
 * RoomEngine — encapsulates all Three.js logic for the Room Designer.
 * React communicates with this via method calls + callback props.
 */
export class RoomEngine {
    constructor() {
        // Three.js core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.orbitControls = null;
        this.transformControls = null;
        this.gridHelper = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();

        // Loaders
        this.gltfLoader = null;
        this.dracoLoader = null;
        this.textureLoader = new THREE.TextureLoader();

        // State
        this.houseModel = null;
        this.houseScale = 1;
        this.houseCenter = new THREE.Vector3();
        this.furnitureItems = []; // { id, name, model, fileSize, originalFile }
        this.selectedFurniture = null;
        this.furnitureIdCounter = 0;
        this.gridVisible = true;
        this.uniformScale = true;
        this.mixers = [];
        this.transformMode = 'translate';

        // First-person mode
        this.isFirstPerson = false;
        this._fpHeight = 1.6; // Human eye height in meters
        this._fpCollisionRadius = 0.3; // Collision capsule radius

        // Mouse tracking for click vs drag
        this.isPointerDown = false;
        this.isRightMouseDown = false;
        this.isDraggingCustom = false;
        this.dragStartPos = null;
        this.mouseDownPos = null;
        this.lastMousePos = null;

        // WASD movement tracking
        this.keys = { w: false, a: false, s: false, d: false, space: false, shift: false };

        // Animation frame
        this._animFrameId = null;
        this._canvas = null;

        // Callbacks (set by React)
        this.onHouseLoaded = null;        // ()
        this.onFurnitureListChanged = null; // (items[])
        this.onSelectionChanged = null;   // (selectedItem | null)
        this.onLoadingStart = null;       // (text)
        this.onLoadingProgress = null;    // (percent)
        this.onLoadingEnd = null;         // ()
        this.onToast = null;              // (message, type)
        this.onScaleChanged = null;       // ({ x, y, z })
        this.onFirstPersonChanged = null; // (boolean)
    }

    /**
     * Initialize the engine with a canvas element.
     */
    init(canvas) {
        this._canvas = canvas;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            0.01,
            1000
        );
        this.camera.position.set(5, 4, 8);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Orbit Controls
        this.orbitControls = new OrbitControls(this.camera, canvas);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.08;
        this.orbitControls.rotateSpeed = 0.8;
        this.orbitControls.panSpeed = 0.5;
        this.orbitControls.zoomSpeed = 1;
        this.orbitControls.minDistance = 0.1;
        this.orbitControls.maxDistance = 200;
        
        // Swap left and right mouse buttons
        this.orbitControls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: '' // Tắt tính năng quay quanh tâm của OrbitControls để tự viết tính năng quay tại chỗ
        };

        // Transform Controls
        this.transformControls = new TransformControls(this.camera, canvas);
        this.transformControls.setSize(0.75);
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });
        this.transformControls.addEventListener('objectChange', () => {
            if (this.selectedFurniture && this.transformControls.mode === 'scale') {
                this._notifyScaleChange();
            }
        });
        this.scene.add(this.transformControls.getHelper());

        // Lighting
        this._setupLighting();

        // Environment
        this._setupEnvironment();

        // Grid
        this.gridHelper = new THREE.GridHelper(30, 60, 0x2a2a3e, 0x1a1a28);
        this.gridHelper.material.opacity = 0.5;
        this.gridHelper.material.transparent = true;
        this.scene.add(this.gridHelper);

        // Loaders
        this.gltfLoader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);

        // Canvas pointer events
        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
        canvas.addEventListener('contextmenu', this._onContextMenu);

        // Window resize
        window.addEventListener('resize', this._onWindowResize);

        // Keyboard shortcuts
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);

        // Pointer lock change (for exiting FP mode when ESC is pressed)
        document.addEventListener('pointerlockchange', this._onPointerLockChange);

        // Start render loop
        this._animate();
    }

    dispose() {
        if (this._animFrameId) {
            cancelAnimationFrame(this._animFrameId);
        }
        if (this._canvas) {
            this._canvas.removeEventListener('pointerdown', this._onPointerDown);
            this._canvas.removeEventListener('pointermove', this._onPointerMove);
            this._canvas.removeEventListener('pointerup', this._onPointerUp);
            this._canvas.removeEventListener('contextmenu', this._onContextMenu);
        }
        window.removeEventListener('resize', this._onWindowResize);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        document.removeEventListener('pointerlockchange', this._onPointerLockChange);

        this.transformControls?.dispose();
        this.orbitControls?.dispose();
        this.renderer?.dispose();
    }

    // =====================================================================
    // LIGHTING
    // =====================================================================
    _setupLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xfff5ee, 1.2);
        keyLight.position.set(5, 10, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 60;
        keyLight.shadow.camera.left = -15;
        keyLight.shadow.camera.right = 15;
        keyLight.shadow.camera.top = 15;
        keyLight.shadow.camera.bottom = -15;
        keyLight.shadow.bias = -0.001;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x8ecae6, 0.5);
        fillLight.position.set(-5, 6, -3);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.3);
        rimLight.position.set(0, 3, -10);
        this.scene.add(rimLight);

        const hemi = new THREE.HemisphereLight(0xb0d0ff, 0x1a1a2e, 0.5);
        this.scene.add(hemi);
    }

    // =====================================================================
    // ENVIRONMENT
    // =====================================================================
    _setupEnvironment() {
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = 2;
        bgCanvas.height = 512;
        const ctx = bgCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#14141f');
        gradient.addColorStop(0.5, '#0d0d14');
        gradient.addColorStop(1, '#0a0a0f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2, 512);
        const bgTexture = new THREE.CanvasTexture(bgCanvas);
        this.scene.background = bgTexture;
    }

    // =====================================================================
    // HOUSE LOADING & GENERATION
    // =====================================================================
    buildHouse(shapeId) {
        this.onLoadingStart?.('Đang dựng phòng...');
        
        if (this.houseModel) {
            this.scene.remove(this.houseModel);
            this._disposeModel(this.houseModel);
        }

        const roomGroup = new THREE.Group();
        roomGroup.userData.isHouse = true;

        // Base unit: 1 unit = 1 meter
        const wallHeight = 3.0;
        const wallThickness = 0.2;
        let points = [];

        // Define room outlines (x, z coordinates), CCW order
        switch (shapeId) {
            case 'square':
                points = [
                    new THREE.Vector2(-4, -4),
                    new THREE.Vector2(4, -4),
                    new THREE.Vector2(4, 4),
                    new THREE.Vector2(-4, 4)
                ];
                break;
            case 'l-shape':
                points = [
                    new THREE.Vector2(-4, -4),
                    new THREE.Vector2(4, -4),
                    new THREE.Vector2(4, 0),
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0, 4),
                    new THREE.Vector2(-4, 4)
                ];
                break;
            case 'u-shape':
                points = [
                    new THREE.Vector2(-4, -4),
                    new THREE.Vector2(4, -4),
                    new THREE.Vector2(4, 4),
                    new THREE.Vector2(2, 4),
                    new THREE.Vector2(2, 0),
                    new THREE.Vector2(-2, 0),
                    new THREE.Vector2(-2, 4),
                    new THREE.Vector2(-4, 4)
                ];
                break;
            case 't-shape':
                points = [
                    new THREE.Vector2(-4, -2),
                    new THREE.Vector2(4, -2),
                    new THREE.Vector2(4, 2),
                    new THREE.Vector2(2, 2),
                    new THREE.Vector2(2, 6),
                    new THREE.Vector2(-2, 6),
                    new THREE.Vector2(-2, 2),
                    new THREE.Vector2(-4, 2)
                ];
                break;
            default:
                // Fallback to square
                points = [
                    new THREE.Vector2(-4, -4),
                    new THREE.Vector2(4, -4),
                    new THREE.Vector2(4, 4),
                    new THREE.Vector2(-4, 4)
                ];
        }

        // Tăng kích thước phòng x3
        points.forEach(p => {
            p.x *= 3;
            p.y *= 3;
        });

        // Materials
        const floorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9 });

        // 1. Build Floor
        const shape = new THREE.Shape(points);
        const floorGeo = new THREE.ShapeGeometry(shape);
        // ShapeGeometry is built on XY plane, we need XZ
        floorGeo.rotateX(-Math.PI / 2);
        
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.userData.isFloor = true;
        floorMesh.position.y = 0;
        roomGroup.add(floorMesh);

        // 2. Build Walls
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            const x1 = p1.x;
            const z1 = -p1.y; // ShapeGeometry rotateX(-Math.PI / 2) maps Y to -Z
            const x2 = p2.x;
            const z2 = -p2.y;

            const dx = x2 - x1;
            const dz = z2 - z1;
            const length = Math.sqrt(dx * dx + dz * dz);
            
            // Add wall thickness to length so corners overlap properly
            const wallGeo = new THREE.BoxGeometry(length + wallThickness, wallHeight, wallThickness);
            const wallMesh = new THREE.Mesh(wallGeo, wallMat);
            
            // Position at center of segment
            wallMesh.position.set(
                x1 + dx / 2,
                wallHeight / 2,
                z1 + dz / 2
            );
            
            // Rotation
            const angle = Math.atan2(dz, dx);
            wallMesh.rotation.y = -angle;

            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            wallMesh.userData.isWall = true;
            
            roomGroup.add(wallMesh);
        }

        this.scene.add(roomGroup);
        this.houseModel = roomGroup;

        // Compute Center and scale
        const box = new THREE.Box3().setFromObject(roomGroup);
        const size = box.getSize(new THREE.Vector3());
        this.houseScale = 1; 
        this.houseCenter = box.getCenter(new THREE.Vector3());

        // Camera fit
        const maxScaled = Math.max(size.x, size.y, size.z);
        const dist = maxScaled * 1.8;
        this.camera.position.set(dist * 0.7, dist * 0.6, dist * 0.7);
        this.orbitControls.target.set(0, size.y * 0.35, 0);
        this.orbitControls.update();

        this.onLoadingEnd?.();
        this.onHouseLoaded?.();
        this.onToast?.('Phòng đã được tạo', 'success');
    }

    loadHouse(file) {
        this.onLoadingStart?.('Đang tải nhà...');
        const url = URL.createObjectURL(file);

        this.gltfLoader.load(
            url,
            (gltf) => {
                // Clear previous house
                if (this.houseModel) {
                    this.scene.remove(this.houseModel);
                    this._disposeModel(this.houseModel);
                }

                const model = gltf.scene;

                // Compute bounds
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                this.houseScale = 6 / maxDim;
                this.houseCenter = center.clone();

                model.scale.setScalar(this.houseScale);
                model.position.set(
                    -center.x * this.houseScale,
                    -box.min.y * this.houseScale,
                    -center.z * this.houseScale
                );

                // Enable shadows
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                model.userData.isHouse = true;
                this.scene.add(model);
                this.houseModel = model;

                // Handle animations
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach(clip => {
                        mixer.clipAction(clip).play();
                    });
                    this.mixers.push(mixer);
                }

                // Camera fit
                const scaledBox = new THREE.Box3().setFromObject(model);
                const scaledSize = scaledBox.getSize(new THREE.Vector3());
                const maxScaled = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
                const dist = maxScaled * 1.8;
                this.camera.position.set(dist * 0.7, dist * 0.6, dist * 0.7);
                this.orbitControls.target.set(0, scaledSize.y * 0.35, 0);
                this.orbitControls.update();

                this.onLoadingEnd?.();
                this.onHouseLoaded?.();
                this.onToast?.(`Nhà "${file.name}" đã được tải`, 'success');

                URL.revokeObjectURL(url);
            },
            (progress) => {
                if (progress.total > 0) {
                    const pct = Math.round((progress.loaded / progress.total) * 100);
                    this.onLoadingProgress?.(pct);
                }
            },
            (error) => {
                console.error('Error loading house:', error);
                this.onLoadingEnd?.();
                this.onToast?.('Lỗi tải file nhà. Kiểm tra file .glb hợp lệ.', 'error');
                URL.revokeObjectURL(url);
            }
        );
    }

    // =====================================================================
    // FURNITURE LOADING
    // =====================================================================
    loadFurniture(file) {
        this.onLoadingStart?.('Đang tải nội thất...');
        const url = URL.createObjectURL(file);

        this.gltfLoader.load(
            url,
            (gltf) => {
                const model = gltf.scene;

                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);

                const furnitureScale = 1.5 / maxDim;
                model.scale.setScalar(furnitureScale);

                model.position.set(
                    -center.x * furnitureScale,
                    -box.min.y * furnitureScale,
                    -center.z * furnitureScale
                );

                // Enable shadows
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Wrapper group
                const wrapper = new THREE.Group();
                wrapper.add(model);
                wrapper.userData.isFurniture = true;
                wrapper.userData.furnitureId = ++this.furnitureIdCounter;
                wrapper.userData.furnitureName = file.name.replace(/\.(glb|gltf)$/i, '');
                wrapper.userData.baseScale = 1;

                this.scene.add(wrapper);

                // Handle animations
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach(clip => {
                        mixer.clipAction(clip).play();
                    });
                    this.mixers.push(mixer);
                    wrapper.userData.mixer = mixer;
                }

                // Store in list
                const item = {
                    id: wrapper.userData.furnitureId,
                    name: wrapper.userData.furnitureName,
                    model: wrapper,
                    fileSize: file.size,
                    originalFile: file
                };
                this.furnitureItems.push(item);

                this.onLoadingEnd?.();
                this.onFurnitureListChanged?.(this._getFurnitureListData());
                this.selectFurniture(wrapper);
                this.onToast?.(`"${item.name}" đã được thêm`, 'success');

                URL.revokeObjectURL(url);
            },
            (progress) => {
                if (progress.total > 0) {
                    const pct = Math.round((progress.loaded / progress.total) * 100);
                    this.onLoadingProgress?.(pct);
                }
            },
            (error) => {
                console.error('Error loading furniture:', error);
                this.onLoadingEnd?.();
                this.onToast?.('Lỗi tải nội thất. Kiểm tra file .glb hợp lệ.', 'error');
                URL.revokeObjectURL(url);
            }
        );
    }

    // =====================================================================
    // SELECTION & TRANSFORM
    // =====================================================================
    selectFurniture(object) {
        let target = object;
        while (target && !target.userData.isFurniture) {
            target = target.parent;
        }
        if (!target || !target.userData.isFurniture) return;

        this.selectedFurniture = target;
        
        if (this.transformMode !== 'translate') {
            this.transformControls.attach(target);
        } else {
            this.transformControls.detach();
        }

        const item = this.furnitureItems.find(f => f.id === target.userData.furnitureId);
        this.onSelectionChanged?.(item ? {
            id: item.id,
            name: item.name,
            scale: this._getScalePercent()
        } : null);
    }

    deselectFurniture() {
        this.selectedFurniture = null;
        this.transformControls.detach();
        this.onSelectionChanged?.(null);
    }

    deleteFurniture(id) {
        const index = this.furnitureItems.findIndex(f => f.id === id);
        if (index === -1) return;

        const item = this.furnitureItems[index];

        if (this.selectedFurniture === item.model) {
            this.deselectFurniture();
        }

        // Remove mixer
        if (item.model.userData.mixer) {
            const mixerIdx = this.mixers.indexOf(item.model.userData.mixer);
            if (mixerIdx !== -1) this.mixers.splice(mixerIdx, 1);
        }

        this.scene.remove(item.model);
        this._disposeModel(item.model);
        this.furnitureItems.splice(index, 1);

        this.onFurnitureListChanged?.(this._getFurnitureListData());
        this.onToast?.(`"${item.name}" đã được xóa`);
    }

    duplicateFurniture(id) {
        const item = this.furnitureItems.find(f => f.id === id);
        if (!item || !item.originalFile) return;
        this.loadFurniture(item.originalFile);
    }

    selectFurnitureById(id) {
        const item = this.furnitureItems.find(f => f.id === id);
        if (item) {
            this.selectFurniture(item.model);
        }
    }

    setTransformMode(mode) {
        this.transformMode = mode;
        if (mode === 'translate') {
            this.transformControls.detach();
        } else {
            this.transformControls.setMode(mode);
            if (this.selectedFurniture) {
                this.transformControls.attach(this.selectedFurniture);
            }
        }
    }

    // =====================================================================
    // RESIZE
    // =====================================================================
    applyResize(axis, percent) {
        if (!this.selectedFurniture) return;

        const baseScale = this.selectedFurniture.userData.baseScale || 1;
        const newScale = (percent / 100) * baseScale;

        if (this.uniformScale) {
            this.selectedFurniture.scale.set(newScale, newScale, newScale);
        } else {
            this.selectedFurniture.scale[axis] = newScale;
        }

        this._notifyScaleChange();
    }

    resetSize() {
        if (!this.selectedFurniture) return;
        const baseScale = this.selectedFurniture.userData.baseScale || 1;
        this.selectedFurniture.scale.set(baseScale, baseScale, baseScale);
        this._notifyScaleChange();
    }

    setUniformScale(uniform) {
        this.uniformScale = uniform;
    }

    _getScalePercent() {
        if (!this.selectedFurniture) return { x: 100, y: 100, z: 100 };
        const baseScale = this.selectedFurniture.userData.baseScale || 1;
        return {
            x: Math.round((this.selectedFurniture.scale.x / baseScale) * 100),
            y: Math.round((this.selectedFurniture.scale.y / baseScale) * 100),
            z: Math.round((this.selectedFurniture.scale.z / baseScale) * 100),
        };
    }

    _notifyScaleChange() {
        this.onScaleChanged?.(this._getScalePercent());
    }

    // =====================================================================
    // CAMERA & GRID
    // =====================================================================
    resetCamera() {
        if (!this.houseModel) return;
        const box = new THREE.Box3().setFromObject(this.houseModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const dist = maxDim * 1.8;

        this._animateCamera(
            new THREE.Vector3(dist * 0.7, dist * 0.6, dist * 0.7),
            new THREE.Vector3(0, size.y * 0.35, 0)
        );
    }

    toggleGrid() {
        this.gridVisible = !this.gridVisible;
        this.gridHelper.visible = this.gridVisible;
        return this.gridVisible;
    }

    // =====================================================================
    // PRIVATE — RAYCASTING & DRAGGING
    // =====================================================================
    _onViewportClick(event) {
        if (this.transformControls.dragging) return;

        const canvas = this._canvas;
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const meshes = [];
        this.furnitureItems.forEach(item => {
            item.model.traverse(child => {
                if (child.isMesh) meshes.push(child);
            });
        });

        const intersects = this.raycaster.intersectObjects(meshes, false);

        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target && !target.userData.isFurniture) {
                target = target.parent;
            }
            if (target && target.userData.isFurniture) {
                this.selectFurniture(target);
                return;
            }
        }

        this.deselectFurniture();
    }

    // Arrow functions to preserve `this`
    _onContextMenu = (e) => {
        e.preventDefault();
    };

    _onPointerLockChange = () => {
        // If pointer lock was lost while in FP mode, exit FP mode
        if (this.isFirstPerson && document.pointerLockElement !== this._canvas) {
            this.setFirstPersonMode(false);
        }
    };

    _onPointerDown = (e) => {
        if (e.button === 2) { // Chuột phải
            this.isRightMouseDown = true;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
            return;
        }

        if (e.button !== 0) return; // Chỉ xử lý thao tác với chuột trái

        this.isPointerDown = true;
        this.mouseDownPos = { x: e.clientX, y: e.clientY };
        this.dragStartPos = { x: e.clientX, y: e.clientY };
        
        if (this.transformMode === 'translate' && !this.transformControls.dragging) {
            const canvas = this._canvas;
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            const meshes = [];
            this.furnitureItems.forEach(item => {
                item.model.traverse(child => {
                    if (child.isMesh) meshes.push(child);
                });
            });
            const intersects = this.raycaster.intersectObjects(meshes, false);
            
            if (intersects.length > 0) {
                let target = intersects[0].object;
                while (target && !target.userData.isFurniture) target = target.parent;
                
                if (target && target.userData.isFurniture) {
                    this.selectFurniture(target);
                }
            }
        }
    };

    /**
     * Shared logic for first-person camera rotation (yaw + pitch).
     */
    _applyFPLook(dx, dy) {
        const sensitivity = 0.003;
        const dist = Math.max(0.1, this.camera.position.distanceTo(this.orbitControls.target));
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);

        // Yaw (quanh trục Y thế giới)
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dx * sensitivity);

        // Pitch (quanh trục X nội bộ) — clamp để không lật camera
        const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();
        const currentPitch = Math.asin(THREE.MathUtils.clamp(forward.y, -1, 1));
        const newPitch = THREE.MathUtils.clamp(currentPitch - dy * sensitivity, -Math.PI / 2 + 0.1, Math.PI / 2 - 0.1);
        const pitchDelta = newPitch - currentPitch;
        forward.applyAxisAngle(right, pitchDelta);

        this.orbitControls.target.copy(this.camera.position).add(forward.multiplyScalar(dist));
        this.orbitControls.update();
    }

    _onPointerMove = (e) => {
        // First-person pointer-lock: mouse moves camera automatically
        if (this.isFirstPerson && document.pointerLockElement === this._canvas) {
            this._applyFPLook(e.movementX, e.movementY);
            return;
        }

        // Normal mode: right-click to look around
        if (this.isRightMouseDown) {
            const dx = e.clientX - this.lastMousePos.x;
            const dy = e.clientY - this.lastMousePos.y;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
            this._applyFPLook(dx, dy);
            return;
        }

        if (!this.isPointerDown) return;
        
        const dx = Math.abs(e.clientX - this.dragStartPos.x);
        const dy = Math.abs(e.clientY - this.dragStartPos.y);
        
        if (this.transformMode === 'translate' && this.selectedFurniture && (dx > 3 || dy > 3 || this.isDraggingCustom)) {
            this.isDraggingCustom = true;
            this.orbitControls.enabled = false;
            
            const rect = this._canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            const collidables = [];
            if (this.houseModel) {
                this.houseModel.traverse(c => { if (c.isMesh) collidables.push(c); });
            }
            this.furnitureItems.forEach(item => {
                if (item.model !== this.selectedFurniture) {
                    item.model.traverse(c => { if (c.isMesh) collidables.push(c); });
                }
            });
            
            const intersects = this.raycaster.intersectObjects(collidables, false);
            
            if (intersects.length > 0) {
                const hit = intersects[0];
                const point = hit.point;
                
                const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
                const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
                
                this.selectedFurniture.position.copy(point);
                
                const box = new THREE.Box3().setFromObject(this.selectedFurniture);
                const size = box.getSize(new THREE.Vector3());
                
                if (worldNormal.y < 0.9) {
                    const offsetX = worldNormal.x * (size.x / 2);
                    const offsetZ = worldNormal.z * (size.z / 2);
                    const offsetY = size.y / 2;
                    
                    this.selectedFurniture.position.add(new THREE.Vector3(offsetX, offsetY, offsetZ));
                }
            } else {
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
                const target = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(plane, target)) {
                    this.selectedFurniture.position.copy(target);
                }
            }
        }
    };

    _onPointerUp = (e) => {
        if (e.button === 2) {
            this.isRightMouseDown = false;
            return;
        }

        if (e.button !== 0) return;

        this.isPointerDown = false;
        this.orbitControls.enabled = true;
        
        if (this.isDraggingCustom) {
            this.isDraggingCustom = false;
            return;
        }
        
        if (!this.mouseDownPos) return;
        const dx = Math.abs(e.clientX - this.mouseDownPos.x);
        const dy = Math.abs(e.clientY - this.mouseDownPos.y);
        if (dx < 5 && dy < 5) {
            this._onViewportClick(e);
        }
        this.mouseDownPos = null;
    };

    _onWindowResize = () => {
        const canvas = this._canvas;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    };

    _onKeyDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        let key = e.key.toLowerCase();
        if (key === ' ') key = 'space';

        if (this.keys && this.keys.hasOwnProperty(key)) {
            this.keys[key] = true;
            if (key === 'space') e.preventDefault(); // Tránh cuộn trang khi bấm Space
        }

        switch (key) {
            case 'g':
                if (this.selectedFurniture) this.setTransformMode('translate');
                break;
            case 'r':
                if (this.selectedFurniture) this.setTransformMode('rotate');
                break;
            case 'c': // Đổi từ 's' sang 'c' để không trùng với phím lùi (S)
                if (this.selectedFurniture) {
                    e.preventDefault();
                    this.setTransformMode('scale');
                }
                break;
            case 'delete':
            case 'backspace':
                if (this.selectedFurniture) {
                    e.preventDefault();
                    this.deleteFurniture(this.selectedFurniture.userData.furnitureId);
                }
                break;
            case 'escape':
                this.deselectFurniture();
                break;
            case 'd':
                if (e.ctrlKey && this.selectedFurniture) {
                    e.preventDefault();
                    this.duplicateFurniture(this.selectedFurniture.userData.furnitureId);
                }
                break;
        }
    };

    _onKeyUp = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        let key = e.key.toLowerCase();
        if (key === ' ') key = 'space';

        if (this.keys && this.keys.hasOwnProperty(key)) {
            this.keys[key] = false;
        }
    };

    // =====================================================================
    // PRIVATE — UTILITIES
    // =====================================================================
    _disposeModel(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.geometry?.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material?.dispose();
                }
            }
        });
    }

    _animateCamera(targetPos, targetLook) {
        const startPos = this.camera.position.clone();
        const startTarget = this.orbitControls.target.clone();
        const duration = 600;
        const startTime = Date.now();

        const update = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);

            this.camera.position.lerpVectors(startPos, targetPos, ease);
            this.orbitControls.target.lerpVectors(startTarget, targetLook, ease);
            this.orbitControls.update();

            if (t < 1) requestAnimationFrame(update);
        };
        update();
    }

    _getFurnitureListData() {
        return this.furnitureItems.map(item => ({
            id: item.id,
            name: item.name,
            fileSize: item.fileSize
        }));
    }

    // =====================================================================
    // TEXTURE LOADING
    // =====================================================================
    _loadTexture(file, callback) {
        const url = URL.createObjectURL(file);
        this.textureLoader.load(
            url,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // Repeat texture (1, 1) means cover the whole floor exactly once
                texture.repeat.set(1, 1); 
                
                callback(texture);
                URL.revokeObjectURL(url);
            },
            undefined,
            (error) => {
                console.error("Error loading texture", error);
                this.onToast?.('Lỗi tải hình ảnh', 'error');
                URL.revokeObjectURL(url);
            }
        );
    }

    applyTextureToFloor(file) {
        this.onLoadingStart?.('Đang áp dụng vật liệu sàn...');
        this._loadTexture(file, (texture) => {
            if (this.houseModel) {
                this.houseModel.children.forEach(child => {
                    if (child.userData.isFloor) {
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                    }
                });
            }
            this.onLoadingEnd?.();
            this.onToast?.('Đã thay đổi bề mặt sàn', 'success');
        });
    }

    applyTextureToWall(file) {
        this.onLoadingStart?.('Đang áp dụng vật liệu tường...');
        this._loadTexture(file, (texture) => {
            // Cover the whole wall exactly once
            const wallTex = texture.clone();
            wallTex.repeat.set(1, 1);

            if (this.houseModel) {
                this.houseModel.children.forEach(child => {
                    if (child.userData.isWall) {
                        child.material.map = wallTex;
                        child.material.needsUpdate = true;
                    }
                });
            }
            this.onLoadingEnd?.();
            this.onToast?.('Đã thay đổi bề mặt tường', 'success');
        });
    }

    setFirstPersonMode(enable) {
        // Toggle if no argument given
        if (enable === undefined) {
            enable = !this.isFirstPerson;
        }
        this.isFirstPerson = enable;

        if (enable) {
            // Deselect any furniture
            this.deselectFurniture();

            // Position camera at human eye height inside the room
            this.camera.position.set(0, this._fpHeight, 5);
            this.camera.lookAt(0, this._fpHeight, 0);

            // Disable orbit features: no pan, no zoom
            this.orbitControls.enablePan = false;
            this.orbitControls.enableZoom = false;
            this.orbitControls.enableRotate = false;
            this.orbitControls.target.set(0, this._fpHeight, 0);
            this.orbitControls.update();

            // Request pointer lock for free mouse-look (like FPS game)
            this._canvas?.requestPointerLock?.();

            this.onToast?.('Góc nhìn thứ nhất: WASD di chuyển, di chuột nhìn xung quanh, ESC hoặc nhấn lại để thoát.', 'info');
        } else {
            // Exit pointer lock
            if (document.pointerLockElement === this._canvas) {
                document.exitPointerLock?.();
            }

            // Restore orbit controls
            this.orbitControls.enablePan = true;
            this.orbitControls.enableZoom = true;
            this.orbitControls.enableRotate = false; // We handle right-click rotate ourselves

            // Reset camera to overview position
            this._animateCamera(
                new THREE.Vector3(20, 20, 20),
                new THREE.Vector3(0, 0, 0)
            );

            this.onToast?.('Đã trở lại chế độ xem tổng quan.', 'info');
        }

        this.onFirstPersonChanged?.(this.isFirstPerson);
    }

    /**
     * Check if moving to `newPos` would collide with walls or furniture.
     * Returns true if blocked.
     */
    _checkCollision(newPos) {
        const directions = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];

        const collidables = [];
        if (this.houseModel) {
            this.houseModel.traverse(c => {
                if (c.isMesh && c.userData.isWall) collidables.push(c);
            });
        }
        this.furnitureItems.forEach(item => {
            item.model.traverse(c => {
                if (c.isMesh) collidables.push(c);
            });
        });

        if (collidables.length === 0) return false;

        const origin = newPos.clone();
        origin.y = this._fpHeight * 0.5; // Check at waist height

        for (const dir of directions) {
            this.raycaster.set(origin, dir);
            this.raycaster.far = this._fpCollisionRadius;
            const hits = this.raycaster.intersectObjects(collidables, false);
            if (hits.length > 0) {
                return true; // Blocked
            }
        }
        return false;
    }

    // =====================================================================
    // RENDER LOOP
    // =====================================================================
    _animate = () => {
        this._animFrameId = requestAnimationFrame(this._animate);
        const delta = this.clock.getDelta();
        
        // Handle WASD movement
        if (this.keys && (this.keys.w || this.keys.a || this.keys.s || this.keys.d || this.keys.space || this.keys.shift)) {
            const moveVec = new THREE.Vector3();
            
            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);
            
            if (this.isFirstPerson) {
                // ====== FIRST-PERSON MODE ======
                const moveSpeed = 4.0 * delta; // Walking speed
                
                // Flatten forward to horizontal plane (no flying)
                forward.y = 0;
                if (forward.lengthSq() > 0) forward.normalize();
                
                const right = new THREE.Vector3();
                right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
                if (right.lengthSq() > 0) right.normalize();
                
                if (this.keys.w) moveVec.add(forward.clone().multiplyScalar(moveSpeed));
                if (this.keys.s) moveVec.add(forward.clone().multiplyScalar(-moveSpeed));
                if (this.keys.a) moveVec.add(right.clone().multiplyScalar(-moveSpeed));
                if (this.keys.d) moveVec.add(right.clone().multiplyScalar(moveSpeed));
                // No vertical movement in FP mode (Space/Shift ignored)
                
                if (moveVec.lengthSq() > 0) {
                    // Check collision before moving
                    const candidatePos = this.camera.position.clone().add(moveVec);
                    if (!this._checkCollision(candidatePos)) {
                        this.camera.position.add(moveVec);
                        this.orbitControls.target.add(moveVec);
                    }
                    // Lock camera Y to fixed height, preserve look angle
                    const targetOffsetY = this.orbitControls.target.y - this.camera.position.y;
                    this.camera.position.y = this._fpHeight;
                    this.orbitControls.target.y = this._fpHeight + targetOffsetY;
                }
            } else {
                // ====== NORMAL (ORBIT) MODE ======
                const moveSpeed = 8.0 * delta;
                
                if (forward.lengthSq() > 0) forward.normalize();
                
                const right = new THREE.Vector3();
                right.crossVectors(forward, this.camera.up);
                if (right.lengthSq() > 0) right.normalize();
                
                if (this.keys.w) moveVec.add(forward.clone().multiplyScalar(moveSpeed));
                if (this.keys.s) moveVec.add(forward.clone().multiplyScalar(-moveSpeed));
                if (this.keys.a) moveVec.add(right.clone().multiplyScalar(-moveSpeed));
                if (this.keys.d) moveVec.add(right.clone().multiplyScalar(moveSpeed));
                
                // Bay lên/xuống (Trục Y thế giới)
                if (this.keys.space) moveVec.y += moveSpeed;
                if (this.keys.shift) moveVec.y -= moveSpeed;
                
                if (moveVec.lengthSq() > 0) {
                    this.camera.position.add(moveVec);
                    this.orbitControls.target.add(moveVec);
                }
            }
        }
        
        this.mixers.forEach(m => m.update(delta));
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    };
}

// =========================================================================
// Helper: format file size
// =========================================================================
export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
