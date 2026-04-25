import { useRef, useCallback } from 'react';
import UploadOverlay from './UploadOverlay';
import LoadingOverlay from './LoadingOverlay';

export default function Viewport({
    canvasRef,
    isHouseLoaded,
    isLoading,
    loadingText,
    loadingPercent,
    onHouseFileSelected,
    onFurnitureFileDrop,
}) {
    const handleBodyDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isHouseLoaded) return;
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
                onFurnitureFileDrop(file);
            }
        });
    }, [isHouseLoaded, onFurnitureFileDrop]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    return (
        <div
            id="viewport"
            onDrop={handleBodyDrop}
            onDragOver={handleDragOver}
        >
            <canvas ref={canvasRef} id="three-canvas"></canvas>

            {!isHouseLoaded && (
                <UploadOverlay onFileSelected={onHouseFileSelected} />
            )}

            <LoadingOverlay
                isLoading={isLoading}
                text={loadingText}
                percent={loadingPercent}
            />
        </div>
    );
}
