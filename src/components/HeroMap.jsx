import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PeopleMarker from './PeopleMarker';
import StaycationPreviewCard from './StaycationPreviewCard';

export default function HeroMap() {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) return;

        // Cleanup any existing map instance on hot-reload
        if (mapRef.current._leaflet_id) {
            mapRef.current._leaflet_id = null;
        }

        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false,
            touchZoom: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
        }).addTo(map);

        const mapCenter = [10.7769, 106.7009];

        const userIcon = L.divIcon({
            className: 'clear-leaflet-icon',
            iconSize: [41, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -50]
        });

        // Add the user marker, initially centered, position will be updated in handleResize
        const userMarker = L.marker(mapCenter, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

        const homeIcon = L.icon({
            iconUrl: '/home.webp',
            iconSize: [41, 50],
            iconAnchor: [20, 50]
        });

        let currentRoots = [];
        let currentIsMobile = null;
        let staycationMarker = null;
        let isAnimating = true;

        const runAnimation = async () => {
            while (isAnimating) {
                if (!userMarker || !staycationMarker || !map.hasLayer(userMarker) || !map.hasLayer(staycationMarker)) {
                    await new Promise(r => setTimeout(r, 500));
                    continue;
                }

                userMarker.openPopup();
                staycationMarker.closePopup();

                await new Promise(r => setTimeout(r, 2000));
                if (!isAnimating) break;

                userMarker.closePopup();

                await new Promise(r => setTimeout(r, 500));
                if (!isAnimating) break;

                if (staycationMarker && map.hasLayer(staycationMarker)) {
                    staycationMarker.openPopup();
                }

                await new Promise(r => setTimeout(r, 2000));
                if (!isAnimating) break;

                if (staycationMarker && map.hasLayer(staycationMarker)) {
                    staycationMarker.closePopup();
                }

                await new Promise(r => setTimeout(r, 500));
            }
        };

        runAnimation();

        const handleResize = () => {
            const isMobile = window.innerWidth < 768;

            // Calculate coordinates based on screen size
            const userCoords = isMobile
                ? [mapCenter[0] - 0.004, mapCenter[1] - 0.002]
                : [mapCenter[0] - 0.002, mapCenter[1] - 0.002];

            const homeCoords = isMobile
                ? [mapCenter[0] - 0.004, mapCenter[1] + 0.002]
                : [mapCenter[0] - 0.002, mapCenter[1] + 0.002];

            // Always update user marker position on resize
            userMarker.setLatLng(userCoords);

            // Only rebuild markers if the mobile breakpoint changes (or on initial load)
            if (currentIsMobile !== isMobile) {
                currentIsMobile = isMobile;
                // slightly zoomed out on mobile so the scattered markers & popups fit
                const targetZoom = isMobile ? 15 : 16;

                map.setView(mapCenter, targetZoom);

                staycationMarker = null;
                // Clear existing staycation markers & react roots
                markersRef.current.forEach(m => m.remove());
                markersRef.current = [];
                currentRoots.forEach(root => root.unmount());
                currentRoots = [];

                setTimeout(() => {
                    // Initialize user marker react content only once
                    if (userMarker.getElement() && !userMarker._hasReactRoot) {
                        const root = createRoot(userMarker.getElement());
                        root.render(<PeopleMarker />);
                        userMarker._hasReactRoot = true;

                        userMarker.bindPopup('<div class="user-popup-content">Bạn đang ở đây!</div>', {
                            closeButton: false,
                            autoClose: false,
                            closeOnClick: false,
                            autoPan: false,
                            offset: [0, 7]
                        });
                    }

                    // Add the single staycation marker
                    const marker = L.marker(homeCoords, { icon: homeIcon }).addTo(map);
                    markersRef.current.push(marker);

                    marker.bindPopup(` <div class="user-popup-content">Staycation ở đây!</div>`, {
                        className: 'panel',
                        closeButton: false,
                        autoClose: false,
                        closeOnClick: false,
                        autoPan: false,
                        offset: [-2, -45],
                    });

                    staycationMarker = marker;

                }, 0);
            }

            // Re-center just to be safe if browser resize causes any drift
            const targetZoom = isMobile ? 15 : 16;
            map.setView(mapCenter, targetZoom);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            isAnimating = false;
            window.removeEventListener('resize', handleResize);
            markersRef.current.forEach(m => m.remove());
            currentRoots.forEach(r => r.unmount());
            map.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
}
