import { useEffect, useRef, useState, useCallback } from 'react';
import { RoomEngine } from '../engine/roomEngine';

/**
 * Custom hook that manages the Three.js RoomEngine lifecycle.
 * Returns engine methods and reactive state for React components.
 */
export function useThreeEngine(canvasRef) {
    const engineRef = useRef(null);
    const [isHouseLoaded, setIsHouseLoaded] = useState(false);
    const [furnitureList, setFurnitureList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [toasts, setToasts] = useState([]);
    const [gridActive, setGridActive] = useState(true);
    const [transformMode, setTransformMode] = useState('translate');
    const [scale, setScale] = useState({ x: 100, y: 100, z: 100 });
    const [uniformScale, setUniformScale] = useState(true);
    const toastIdRef = useRef(0);

    // Initialize engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new RoomEngine();

        // Wire up callbacks
        engine.onHouseLoaded = () => {
            setIsHouseLoaded(true);
        };

        engine.onFurnitureListChanged = (items) => {
            setFurnitureList([...items]);
        };

        engine.onSelectionChanged = (item) => {
            setSelectedItem(item || null);
            if (item) {
                setScale(item.scale);
            }
        };

        engine.onLoadingStart = (text) => {
            setIsLoading(true);
            setLoadingText(text);
            setLoadingPercent(0);
        };

        engine.onLoadingProgress = (pct) => {
            setLoadingPercent(pct);
        };

        engine.onLoadingEnd = () => {
            setIsLoading(false);
        };

        engine.onToast = (message, type = '') => {
            const id = ++toastIdRef.current;
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        };

        engine.onScaleChanged = (s) => {
            setScale(s);
        };

        engine.init(canvas);
        engineRef.current = engine;

        return () => {
            engine.dispose();
            engineRef.current = null;
        };
    }, [canvasRef]);

    // ===== Engine method wrappers =====
    const buildHouse = useCallback((shapeId) => {
        engineRef.current?.buildHouse(shapeId);
    }, []);

    const loadHouse = useCallback((file) => {
        engineRef.current?.loadHouse(file);
    }, []);

    const loadFurniture = useCallback((file) => {
        engineRef.current?.loadFurniture(file);
    }, []);

    const applyTextureToFloor = useCallback((file) => {
        engineRef.current?.applyTextureToFloor(file);
    }, []);

    const applyTextureToWall = useCallback((file) => {
        engineRef.current?.applyTextureToWall(file);
    }, []);

    const selectFurnitureById = useCallback((id) => {
        engineRef.current?.selectFurnitureById(id);
    }, []);

    const deselectFurniture = useCallback(() => {
        engineRef.current?.deselectFurniture();
    }, []);

    const deleteFurniture = useCallback((id) => {
        engineRef.current?.deleteFurniture(id);
    }, []);

    const duplicateFurniture = useCallback((id) => {
        engineRef.current?.duplicateFurniture(id);
    }, []);

    const changeTransformMode = useCallback((mode) => {
        engineRef.current?.setTransformMode(mode);
        setTransformMode(mode);
    }, []);

    const applyResize = useCallback((axis, percent) => {
        engineRef.current?.applyResize(axis, percent);
    }, []);

    const resetSize = useCallback(() => {
        engineRef.current?.resetSize();
    }, []);

    const toggleUniformScale = useCallback(() => {
        setUniformScale(prev => {
            const next = !prev;
            engineRef.current?.setUniformScale(next);
            return next;
        });
    }, []);

    const resetCamera = useCallback(() => {
        engineRef.current?.resetCamera();
    }, []);

    const toggleGrid = useCallback(() => {
        const visible = engineRef.current?.toggleGrid();
        setGridActive(visible);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return {
        // State
        isHouseLoaded,
        furnitureList,
        selectedItem,
        isLoading,
        loadingText,
        loadingPercent,
        toasts,
        gridActive,
        transformMode,
        scale,
        uniformScale,

        // Methods
        buildHouse,
        loadHouse,
        loadFurniture,
        applyTextureToFloor,
        applyTextureToWall,
        selectFurnitureById,
        deselectFurniture,
        deleteFurniture,
        duplicateFurniture,
        changeTransformMode,
        applyResize,
        resetSize,
        toggleUniformScale,
        resetCamera,
        toggleGrid,
        removeToast,
    };
}
