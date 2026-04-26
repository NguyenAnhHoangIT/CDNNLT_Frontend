import { useRef, useCallback, useState, useEffect } from 'react';
import { useThreeEngine } from '../hooks/useThreeEngine';
import Header from './Header';
import Viewport from './Viewport';
import FurniturePanel from './FurniturePanel';
import SelectionBar from './SelectionBar';
import ResizePanel from './ResizePanel';
import ToastContainer from './ToastContainer';
import HelpTip from './HelpTip';
import HouseShapeModal from './HouseShapeModal';
import { useLocation } from 'react-router-dom';

export default function DesignerPage() {
    const [showShapeModal, setShowShapeModal] = useState(false);
    const [selectedShape, setSelectedShape] = useState(null);
    const canvasRef = useRef(null);
    const furnitureInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const textureInputRef = useRef(null);
    const uploadTargetRef = useRef(null);
    const location = useLocation();

    const {
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
        isFirstPerson,
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
        setFirstPersonMode,
        toggleGrid,
    } = useThreeEngine(canvasRef);

    // Show modal on mount if no house loaded
    useEffect(() => {
        if (!isHouseLoaded && !selectedShape) {
            // Slight delay so the user sees the page transition before modal appears
            const timer = setTimeout(() => {
                setShowShapeModal(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isHouseLoaded, selectedShape]);

    const handleShapeSelect = useCallback((shape) => {
        setSelectedShape(shape);
        setShowShapeModal(false);

        // If user chose "custom", prompt file upload after transition
        if (shape.id === 'custom') {
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 500);
        } else {
            // Procedurally generate the room
            buildHouse(shape.id);
        }
    }, [buildHouse]);

    const handleCustomFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) loadHouse(file);
        e.target.value = '';
    }, [loadHouse]);

    const handleAddFurniture = useCallback(() => {
        furnitureInputRef.current?.click();
    }, []);

    const handleFurnitureFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
                loadFurniture(file);
            }
        });
        e.target.value = '';
    }, [loadFurniture]);

    const handleUploadTextureClick = useCallback((id) => {
        uploadTargetRef.current = id;
        textureInputRef.current?.click();
    }, []);

    const handleTextureFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (uploadTargetRef.current === 'sys-floor') {
                applyTextureToFloor(file);
            } else if (uploadTargetRef.current === 'sys-wall') {
                applyTextureToWall(file);
            }
        }
        e.target.value = '';
        uploadTargetRef.current = null;
    }, [applyTextureToFloor, applyTextureToWall]);

    return (
        <div id="app">
            <Header
                isHouseLoaded={isHouseLoaded}
                selectedItem={selectedItem}
                transformMode={transformMode}
                gridActive={gridActive}
                onAddFurniture={handleAddFurniture}
                onResetCamera={resetCamera}
                onFirstPersonMode={setFirstPersonMode}
                isFirstPerson={isFirstPerson}
                onToggleGrid={toggleGrid}
                onChangeTransformMode={changeTransformMode}
            />

            <Viewport
                canvasRef={canvasRef}
                isHouseLoaded={isHouseLoaded}
                isLoading={isLoading}
                loadingText={loadingText}
                loadingPercent={loadingPercent}
                onHouseFileSelected={loadHouse}
                onFurnitureFileDrop={loadFurniture}
            />

            {/* Hidden file inputs */}
            <input
                ref={furnitureInputRef}
                type="file"
                accept=".glb,.gltf"
                multiple
                hidden
                onChange={handleFurnitureFileChange}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                hidden
                onChange={handleCustomFileChange}
            />
            <input
                ref={textureInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleTextureFileChange}
            />

            {isHouseLoaded && (
                <FurniturePanel
                    furnitureList={furnitureList}
                    selectedItem={selectedItem}
                    onSelect={selectFurnitureById}
                    onDuplicate={duplicateFurniture}
                    onDelete={deleteFurniture}
                    onUploadTexture={handleUploadTextureClick}
                />
            )}

            <SelectionBar
                selectedItem={selectedItem}
                onDuplicate={duplicateFurniture}
                onDelete={deleteFurniture}
                onDeselect={deselectFurniture}
            />

            <ResizePanel
                selectedItem={selectedItem}
                scale={scale}
                uniformScale={uniformScale}
                onApplyResize={applyResize}
                onResetSize={resetSize}
                onToggleUniformScale={toggleUniformScale}
            />

            <ToastContainer toasts={toasts} />

            <HelpTip visible={isHouseLoaded} />

            <HouseShapeModal
                isOpen={showShapeModal}
                onClose={() => setShowShapeModal(false)}
                onSelect={handleShapeSelect}
            />
        </div>
    );
}
