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
import AddFurnitureModal from './AddFurnitureModal';
import { useLocation } from 'react-router-dom';

export default function DesignerPage() {
    const [showShapeModal, setShowShapeModal] = useState(false);
    const [showAddFurnitureModal, setShowAddFurnitureModal] = useState(false);
    const [selectedShape, setSelectedShape] = useState(null);
    const canvasRef = useRef(null);
    const furnitureInputRef = useRef(null);
    const fileInputRef = useRef(null);
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

    const modelLoadedRef = useRef(false);

    // Show modal on mount if no house loaded
    useEffect(() => {
        if (!isHouseLoaded && !selectedShape) {
            if (location.state?.generatedModelUrl) {
                const isRoom = location.state?.isRoom;

                if (!modelLoadedRef.current) {
                    modelLoadedRef.current = true;

                    if (isRoom) {
                        // Load the generated model AS the room/scene itself
                        fetch(location.state.generatedModelUrl)
                            .then(res => res.blob())
                            .then(blob => {
                                const filename = location.state.generatedModelUrl.split('/').pop() || 'room.glb';
                                const file = new File([blob], filename, { type: 'model/gltf-binary' });
                                loadHouse(file);
                            })
                            .catch(err => console.error('Failed to load generated room:', err));
                    } else {
                        // Auto generate square room and load as furniture inside it
                        const shape = { id: 'square', dimensions: { length: 8, width: 8 } };
                        setSelectedShape(shape);
                        buildHouse(shape.id, shape.dimensions);

                        fetch(location.state.generatedModelUrl)
                            .then(res => res.blob())
                            .then(blob => {
                                const filename = location.state.generatedModelUrl.split('/').pop() || 'model.glb';
                                const file = new File([blob], filename, { type: 'model/gltf-binary' });
                                loadFurniture(file);
                            })
                            .catch(err => console.error('Failed to load generated model:', err));
                    }
                }

                // Clear state to prevent reloading on refresh
                window.history.replaceState({}, document.title);
            } else {
                // Slight delay so the user sees the page transition before modal appears
                const timer = setTimeout(() => {
                    setShowShapeModal(true);
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isHouseLoaded, selectedShape, location.state, buildHouse, loadHouse, loadFurniture]);

    const handleShapeSelect = useCallback((shape) => {
        setSelectedShape(shape);
        setShowShapeModal(false);

        // If user chose "custom", prompt file upload after transition
        if (shape.id === 'custom') {
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 500);
        } else {
            // Procedurally generate the room with user dimensions
            buildHouse(shape.id, shape.dimensions);
        }
    }, [buildHouse]);

    const handleCustomFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) loadHouse(file);
        e.target.value = '';
    }, [loadHouse]);

    const handleAddFurniture = useCallback(() => {
        setShowAddFurnitureModal(true);
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

            {isHouseLoaded && (
                <FurniturePanel
                    furnitureList={furnitureList}
                    selectedItem={selectedItem}
                    onSelect={selectFurnitureById}
                    onDuplicate={duplicateFurniture}
                    onDelete={deleteFurniture}
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

            <AddFurnitureModal
                isOpen={showAddFurnitureModal}
                onClose={() => setShowAddFurnitureModal(false)}
                onUploadLocal={() => furnitureInputRef.current?.click()}
                onLoadGeneratedModel={(url) => {
                    fetch(url)
                        .then(res => res.blob())
                        .then(blob => {
                            const filename = url.split('/').pop() || 'model.glb';
                            const file = new File([blob], filename, { type: 'model/gltf-binary' });
                            loadFurniture(file);
                        })
                        .catch(err => console.error('Failed to load generated model:', err));
                }}
            />
        </div>
    );
}
