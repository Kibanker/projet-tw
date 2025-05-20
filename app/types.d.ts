// Déclaration de module pour leaflet
declare module 'leaflet' {
  export const icon: any;
  export const Marker: any;
}

// Déclarations pour react-leaflet
declare module 'react-leaflet' {
  export const MapContainer: React.FC<any>;
  export const TileLayer: React.FC<any>;
  export const Marker: React.FC<any>;
  export const Popup: React.FC<any>;
}
