import { Bus, Route, Station, Alert, User, Trip } from '../types';

// Bucaramanga, Colombia coordinates center
export const BUCARAMANGA_CENTER = {
  latitude: 7.1193,
  longitude: -73.1224,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const MOCK_STATIONS: Station[] = [
  { id: 'st_1', name: 'Parque Estación U.I.S.', latitude: 7.137116076546203, longitude: -73.12238982588299, code: 'E-UIS', status: 'ACTIVE' },
  { id: 'st_2', name: 'Br. Universidad (Cl 11 - Kr 29)', latitude: 7.1371422199270595, longitude: -73.11895722930109, code: 'B-UNIV', status: 'ACTIVE' },
  { id: 'st_3', name: 'Estadio Departamental José Américo Montanini', latitude: 7.135549571021365, longitude: -73.11802460835702, code: 'E-ESTA', status: 'ACTIVE' },
  { id: 'st_4', name: 'Velódromo Alfonso Florez Ortíz', latitude: 7.1344696440636595, longitude: -73.11597944119599, code: 'E-VELO', status: 'ACTIVE' },
  { id: 'st_5', name: 'Br. San Alonso (Cl 14 - Kr 32c)', latitude: 7.1343401158811055, longitude: -73.11363705680327, code: 'B-SALO', status: 'ACTIVE' },
  { id: 'st_6', name: 'Quinta Brigada Del Ejército (Kr 33a - Cl 17)', latitude: 7.1340375581461375, longitude: -73.1124960718037, code: 'E-QBRI', status: 'ACTIVE' },
  { id: 'st_7', name: 'Universidad Cooperativa De Colombia', latitude: 7.129041204394557, longitude: -73.11387905486701, code: 'E-UCC', status: 'ACTIVE' },
  { id: 'st_8', name: 'Plaza De Mercado Guarín', latitude: 7.126814141212963, longitude: -73.11291190360203, code: 'E-GUAR', status: 'ACTIVE' },
  { id: 'st_9', name: 'Parque Las Palmas', latitude: 7.120212051461783, longitude: -73.11162037235697, code: 'E-PALM', status: 'ACTIVE' },
  { id: 'st_10', name: 'Centro Comercial Cacique', latitude: 7.099570251113618, longitude: -73.1078579572045, code: 'E-CACI', status: 'ACTIVE' },
  { id: 'st_11', name: 'Estación De Transferencia Provenza', latitude: 7.09095589786415, longitude: -73.10914317332427, code: 'E-PROV', status: 'ACTIVE' },
  { id: 'st_12', name: 'Centro Comercial La Florida', latitude: 7.070759362253019, longitude: -73.10537239455138, code: 'E-FLOR', status: 'ACTIVE' },
  { id: 'st_13', name: 'Instituto Colombiano De Petróleo', latitude: 7.006205108672623, longitude: -73.05572222365805, code: 'E-ICP', status: 'ACTIVE' },
  { id: 'st_14', name: 'Portal Piedecuesta', latitude: 7.00248363799107, longitude: -73.05505173893354, code: 'P-PIED', status: 'ACTIVE' },
  { id: 'st_15', name: 'Piedecuesta Centro', latitude: 6.987068341839905, longitude: -73.05056714137808, code: 'E-PCEN', status: 'ACTIVE' },
  { id: 'st_16', name: 'Br. Hoyo Grande', latitude: 6.9776993895357595, longitude: -73.05135536037994, code: 'B-HOYO', status: 'ACTIVE' },
];

export const MOCK_ROUTES: Route[] = [
  { id: 'rt_t1', name: 'T1 - Troncal Piedecuesta', origin: 'Portal Piedecuesta', destination: 'Portal Quebradaseca', color: '#FF5E13', stations: ['st_1', 'st_2', 'st_3', 'st_4', 'st_5', 'st_6', 'st_7', 'st_8', 'st_9', 'st_10', 'st_11'], isActive: true },
  { id: 'rt_t3', name: 'T3 - Troncal UIS', origin: 'Estación Provenza', destination: 'Estación UIS', color: '#1E40AF', stations: ['st_6', 'st_7', 'st_8', 'st_9', 'st_12', 'st_14'], isActive: true },
  { id: 'rt_p1', name: 'P1 - Pretroncal Centro', origin: 'Estación Real de Minas', destination: 'Estación UIS', color: '#10B981', stations: ['st_15', 'st_8', 'st_9', 'st_10', 'st_12', 'st_14'], isActive: true },
  { id: 'rt_p2', name: 'P2 - Pretroncal Diagonal', origin: 'Portal Cañaveral', destination: 'Estación Parque Turbay', color: '#F59E0B', stations: ['st_4', 'st_5', 'st_6', 'st_7', 'st_13'], isActive: true },
  { id: 'rt_p3', name: 'P3 - Bucarica Express', origin: 'Portal Piedecuesta', destination: 'Estación Real de Minas', color: '#8B5CF6', stations: ['st_1', 'st_4', 'st_6', 'st_15'], isActive: true },
  { id: 'rt_p8', name: 'P8 - Piedecuesta Centro', origin: 'Portal Piedecuesta', destination: 'Portal Quebradaseca', color: '#EC4899', stations: ['st_1', 'st_3', 'st_5', 'st_7', 'st_9', 'st_11'], isActive: true },
  { id: 'rt_rd1', name: 'RD1 - Alimentador Real de Minas', origin: 'Estación Provenza', destination: 'Estación Real de Minas', color: '#06B6D4', stations: ['st_6', 'st_8', 'st_15'], isActive: true },
  { id: 'rt_re1', name: 'RE1 - Provenza Express', origin: 'Portal Piedecuesta', destination: 'Estación Provenza', color: '#D97706', stations: ['st_1', 'st_4', 'st_6'], isActive: true },
  { id: 'rt_ru1', name: 'RU1 - Alimentador UIS', origin: 'Portal Quebradaseca', destination: 'Estación UIS', color: '#4B5563', stations: ['st_11', 'st_12', 'st_14'], isActive: true },
  { id: 'rt_rc1', name: 'RC1 - Alimentador Cañaveral', origin: 'Portal Cañaveral', destination: 'Estación Real de Minas', color: '#14B8A6', stations: ['st_4', 'st_6', 'st_15'], isActive: true },
];

export const MOCK_BUSES: Bus[] = [
  { id: 'bus_101', routeId: 'rt_t1', routeName: 'T1', latitude: 7.0315, longitude: -73.0824, heading: 28, speed: 45, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_102', routeId: 'rt_t1', routeName: 'T1', latitude: 7.0815, longitude: -73.1085, heading: 210, speed: 38, occupancy: 'MEDIUM', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_103', routeId: 'rt_t1', routeName: 'T1', latitude: 7.1152, longitude: -73.1192, heading: 30, speed: 0, occupancy: 'HIGH', status: 'DELAYED', lastUpdated: new Date().toISOString() },
  { id: 'bus_104', routeId: 'rt_t1', routeName: 'T1', latitude: 6.9950, longitude: -73.0560, heading: 208, speed: 50, occupancy: 'FULL', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_301', routeId: 'rt_t3', routeName: 'T3', latitude: 7.0980, longitude: -73.1130, heading: 45, speed: 42, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_302', routeId: 'rt_t3', routeName: 'T3', latitude: 7.1298, longitude: -73.1215, heading: 225, speed: 25, occupancy: 'MEDIUM', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_303', routeId: 'rt_t3', routeName: 'T3', latitude: 7.1390, longitude: -73.1206, heading: 180, speed: 12, occupancy: 'HIGH', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_501', routeId: 'rt_p1', routeName: 'P1', latitude: 7.1120, longitude: -73.1310, heading: 90, speed: 30, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_502', routeId: 'rt_p1', routeName: 'P1', latitude: 7.1250, longitude: -73.1230, heading: 270, speed: 0, occupancy: 'MEDIUM', status: 'OUT_OF_SERVICE', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_601', routeId: 'rt_p2', routeName: 'P2', latitude: 7.0710, longitude: -73.1030, heading: 15, speed: 55, occupancy: 'MEDIUM', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_602', routeId: 'rt_p2', routeName: 'P2', latitude: 7.1100, longitude: -73.1145, heading: 195, speed: 40, occupancy: 'HIGH', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_701', routeId: 'rt_p3', routeName: 'P3', latitude: 7.0010, longitude: -73.0600, heading: 32, speed: 60, occupancy: 'FULL', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_702', routeId: 'rt_p3', routeName: 'P3', latitude: 7.0985, longitude: -73.1220, heading: 130, speed: 35, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_801', routeId: 'rt_p8', routeName: 'P8', latitude: 7.0150, longitude: -73.0710, heading: 50, speed: 20, occupancy: 'MEDIUM', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_802', routeId: 'rt_p8', routeName: 'P8', latitude: 7.1260, longitude: -73.1232, heading: 240, speed: 10, occupancy: 'HIGH', status: 'DELAYED', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_901', routeId: 'rt_rd1', routeName: 'RD1', latitude: 7.0950, longitude: -73.1220, heading: 310, speed: 22, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_902', routeId: 'rt_rd1', routeName: 'RD1', latitude: 7.1110, longitude: -73.1280, heading: 130, speed: 0, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_401', routeId: 'rt_re1', routeName: 'RE1', latitude: 7.0420, longitude: -73.0900, heading: 15, speed: 65, occupancy: 'MEDIUM', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  { id: 'bus_402', routeId: 'rt_re1', routeName: 'RE1', latitude: 7.0890, longitude: -73.1105, heading: 195, speed: 58, occupancy: 'HIGH', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() },
  
  { id: 'bus_201', routeId: 'rt_ru1', routeName: 'RU1', latitude: 7.1350, longitude: -73.1210, heading: 10, speed: 28, occupancy: 'LOW', status: 'OPERATIONAL', lastUpdated: new Date().toISOString() }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    type: 'CONGESTION',
    severity: 'WARNING',
    title: 'Alta Congestión en Autopista Floridablanca',
    message: 'Tráfico pesado reduce la velocidad promedio de los buses a 15 km/h entre Cañaveral y Diamante. Tiempos de viaje incrementados en 12 minutos.',
    routeId: 'rt_t1',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    active: true
  },
  {
    id: 'alt_2',
    type: 'DELAY',
    severity: 'WARNING',
    title: 'Retraso en T3 por mantenimiento vial',
    message: 'Operación con demoras de hasta 8 minutos en la ruta T3 debido a obras de re-pavimentación cerca a la Estación UIS.',
    routeId: 'rt_t3',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    active: true
  },
  {
    id: 'alt_3',
    type: 'ACCIDENT',
    severity: 'CRITICAL',
    title: 'Accidente cerca de Estación La Isla',
    message: 'Colisión vehicular bloquea el carril exclusivo de Metrolínea sentido sur-norte. Se implementa desvío provisional por carril mixto.',
    routeId: 'rt_t1',
    busId: 'bus_103',
    stationId: 'st_8',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    active: true
  },
  {
    id: 'alt_4',
    type: 'ROUTE_CHANGE',
    severity: 'INFO',
    title: 'Desvío temporal ruta P1 por evento cultural',
    message: 'Por desfile cívico en el centro, la ruta P1 tomará la carrera 27 en lugar de la carrera 15 durante el día de hoy.',
    routeId: 'rt_p1',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    active: true
  },
  {
    id: 'alt_5',
    type: 'SUSPENSION',
    severity: 'CRITICAL',
    title: 'Suspensión temporal Alimentador UIS',
    message: 'Línea RU1 suspendida temporalmente por manifestaciones en los alrededores de la Universidad Industrial de Santander.',
    routeId: 'rt_ru1',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    active: true
  }
];

export const MOCK_USER: User = {
  id: 'usr_99',
  name: 'Santiago Bohórquez',
  email: 'santiago.bohorquez@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
  favoriteRoutes: ['rt_t1', 'rt_t3'],
  favoriteStations: ['st_6', 'st_14'],
  tripHistory: [
    { id: 'tp_1', routeId: 'rt_t1', routeName: 'T1', date: '2026-06-18T07:45:00Z', durationMinutes: 24, distanceKm: 8.5, cost: 2800 },
    { id: 'tp_2', routeId: 'rt_t3', routeName: 'T3', date: '2026-06-18T18:12:00Z', durationMinutes: 18, distanceKm: 6.2, cost: 2800 },
    { id: 'tp_3', routeId: 'rt_p2', routeName: 'P2', date: '2026-06-17T12:05:00Z', durationMinutes: 32, distanceKm: 10.1, cost: 2800 },
    { id: 'tp_4', routeId: 'rt_t1', routeName: 'T1', date: '2026-06-16T08:02:00Z', durationMinutes: 28, distanceKm: 8.5, cost: 2800 },
    { id: 'tp_5', routeId: 'rt_rd1', routeName: 'RD1', date: '2026-06-15T14:30:00Z', durationMinutes: 15, distanceKm: 4.0, cost: 0 }
  ]
};
