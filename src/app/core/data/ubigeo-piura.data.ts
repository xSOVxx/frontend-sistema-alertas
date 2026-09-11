export interface UbigeoItem {
  code: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
}

export const UBIGEOS_PIURA: UbigeoItem[] = [
  // PROVINCIA PIURA (2001)
  { code: '200101', district: 'Piura', province: 'Piura', latitude: -5.1945, longitude: -80.6328 },
  { code: '200104', district: 'Castilla', province: 'Piura', latitude: -5.1978, longitude: -80.6133 },
  { code: '200105', district: 'Catacaos', province: 'Piura', latitude: -5.2678, longitude: -80.6736 },
  { code: '200107', district: 'Cura Mori', province: 'Piura', latitude: -5.3217, longitude: -80.6653 },
  { code: '200108', district: 'El Tallán', province: 'Piura', latitude: -5.3783, longitude: -80.6358 },
  { code: '200109', district: 'La Arena', province: 'Piura', latitude: -5.3400, longitude: -80.7000 },
  { code: '200110', district: 'La Unión', province: 'Piura', latitude: -5.4000, longitude: -80.7417 },
  { code: '200111', district: 'Las Lomas', province: 'Piura', latitude: -4.6536, longitude: -80.2458 },
  { code: '200114', district: 'Tambogrande', province: 'Piura', latitude: -4.9272, longitude: -80.3447 },
  { code: '200115', district: 'Veintiséis de Octubre', province: 'Piura', latitude: -5.1833, longitude: -80.6500 },

  // PROVINCIA SULLANA (2006)
  { code: '200601', district: 'Sullana', province: 'Sullana', latitude: -4.9039, longitude: -80.6853 },
  { code: '200602', district: 'Bellavista', province: 'Sullana', latitude: -4.8967, longitude: -80.6789 },
  { code: '200603', district: 'Ignacio Escudero', province: 'Sullana', latitude: -4.8697, longitude: -80.8667 },
  { code: '200604', district: 'Lancones', province: 'Sullana', latitude: -4.5667, longitude: -80.5000 },
  { code: '200605', district: 'Marcavelica', province: 'Sullana', latitude: -4.8739, longitude: -80.7061 },
  { code: '200606', district: 'Miguel Checa', province: 'Sullana', latitude: -4.9167, longitude: -80.7833 },
  { code: '200607', district: 'Querecotillo', province: 'Sullana', latitude: -4.8389, longitude: -80.6500 },
  { code: '200608', district: 'Salitral (Sullana)', province: 'Sullana', latitude: -4.8500, longitude: -80.6833 },

  // PROVINCIA MORROPÓN (2004)
  { code: '200401', district: 'Chulucanas', province: 'Morropón', latitude: -5.0931, longitude: -80.1625 },
  { code: '200402', district: 'Buenos Aires', province: 'Morropón', latitude: -5.2667, longitude: -79.9667 },
  { code: '200403', district: 'Chalaco', province: 'Morropón', latitude: -5.0500, longitude: -79.8000 },
  { code: '200404', district: 'La Matanza', province: 'Morropón', latitude: -5.1917, longitude: -80.2500 },
  { code: '200405', district: 'Morropón', province: 'Morropón', latitude: -5.1833, longitude: -79.9667 },
  { code: '200406', district: 'Salitral (Morropón)', province: 'Morropón', latitude: -5.3167, longitude: -79.8500 },
  { code: '200407', district: 'San Juan de Bigote', province: 'Morropón', latitude: -5.2833, longitude: -79.7667 },
  { code: '200408', district: 'Santa Catalina de Mossa', province: 'Morropón', latitude: -5.1000, longitude: -79.8333 },
  { code: '200409', district: 'Santo Domingo', province: 'Morropón', latitude: -5.0333, longitude: -79.8833 },
  { code: '200410', district: 'Yamango', province: 'Morropón', latitude: -5.1500, longitude: -79.7833 },

  // PROVINCIA PAITA (2005)
  { code: '200501', district: 'Paita', province: 'Paita', latitude: -5.0892, longitude: -81.1144 },
  { code: '200502', district: 'Amotape', province: 'Paita', latitude: -4.8833, longitude: -81.0167 },
  { code: '200503', district: 'Arenal', province: 'Paita', latitude: -4.8833, longitude: -81.0500 },
  { code: '200504', district: 'Colán', province: 'Paita', latitude: -5.0167, longitude: -81.0667 },
  { code: '200505', district: 'La Huaca', province: 'Paita', latitude: -4.9167, longitude: -80.9500 },
  { code: '200506', district: 'Tamarindo', province: 'Paita', latitude: -4.8667, longitude: -81.0000 },
  { code: '200507', district: 'Vichayal', province: 'Paita', latitude: -4.8833, longitude: -81.0833 },

  // PROVINCIA TALARA (2007)
  { code: '200701', district: 'Pariñas (Talara)', province: 'Talara', latitude: -4.5772, longitude: -81.2719 },
  { code: '200702', district: 'El Alto', province: 'Talara', latitude: -4.2667, longitude: -81.2167 },
  { code: '200703', district: 'La Brea (Negritos)', province: 'Talara', latitude: -4.6500, longitude: -81.3000 },
  { code: '200704', district: 'Lobitos', province: 'Talara', latitude: -4.4500, longitude: -81.2833 },
  { code: '200705', district: 'Los Órganos', province: 'Talara', latitude: -4.1833, longitude: -81.1167 },
  { code: '200706', district: 'Máncora', province: 'Talara', latitude: -4.1000, longitude: -81.0500 },

  // PROVINCIA SECHURA (2008)
  { code: '200801', district: 'Sechura', province: 'Sechura', latitude: -5.5569, longitude: -80.8222 },
  { code: '200802', district: 'Bellavista de la Unión', province: 'Sechura', latitude: -5.4167, longitude: -80.7167 },
  { code: '200803', district: 'Bernal', province: 'Sechura', latitude: -5.4417, longitude: -80.7500 },
  { code: '200804', district: 'Cristo Nos Valga', province: 'Sechura', latitude: -5.4667, longitude: -80.6833 },
  { code: '200805', district: 'Rinconada Llícuar', province: 'Sechura', latitude: -5.4500, longitude: -80.7667 },
  { code: '200806', district: 'Vice', province: 'Sechura', latitude: -5.4167, longitude: -80.7833 },

  // PROVINCIA HUANCABAMBA (2003)
  { code: '200301', district: 'Huancabamba', province: 'Huancabamba', latitude: -5.2389, longitude: -79.4500 },
  { code: '200302', district: 'Canchaque', province: 'Huancabamba', latitude: -5.3750, longitude: -79.6056 },
  { code: '200303', district: 'El Carmen de la Frontera', province: 'Huancabamba', latitude: -5.0000, longitude: -79.4167 },
  { code: '200304', district: 'Huarmaca', province: 'Huancabamba', latitude: -5.5667, longitude: -79.5167 },
  { code: '200305', district: 'Lalaquiz', province: 'Huancabamba', latitude: -5.2167, longitude: -79.6833 },
  { code: '200306', district: 'San Miguel de El Faique', province: 'Huancabamba', latitude: -5.4167, longitude: -79.6000 },
  { code: '200307', district: 'Sondor', province: 'Huancabamba', latitude: -5.3000, longitude: -79.4000 },
  { code: '200308', district: 'Sondorillo', province: 'Huancabamba', latitude: -5.3333, longitude: -79.4500 },

  // PROVINCIA AYABACA (2002)
  { code: '200201', district: 'Ayabaca', province: 'Ayabaca', latitude: -4.6397, longitude: -79.7153 },
  { code: '200202', district: 'Frías', province: 'Ayabaca', latitude: -4.9333, longitude: -79.9500 },
  { code: '200203', district: 'Jililí', province: 'Ayabaca', latitude: -4.5333, longitude: -79.8667 },
  { code: '200204', district: 'Lagunas', province: 'Ayabaca', latitude: -4.7833, longitude: -79.8500 },
  { code: '200205', district: 'Montero', province: 'Ayabaca', latitude: -4.6333, longitude: -79.8167 },
  { code: '200206', district: 'Pacaipampa', province: 'Ayabaca', latitude: -4.9833, longitude: -79.6667 },
  { code: '200207', district: 'Paimas', province: 'Ayabaca', latitude: -4.6333, longitude: -80.0167 },
  { code: '200208', district: 'Sapillica', province: 'Ayabaca', latitude: -4.7500, longitude: -80.0000 },
  { code: '200209', district: 'Sicchez', province: 'Ayabaca', latitude: -4.5833, longitude: -79.8000 },
  { code: '200210', district: 'Suyo', province: 'Ayabaca', latitude: -4.5167, longitude: -80.0167 }
];

/**
 * Busca distritos por nombre, provincia o código ubigeo.
 * Si el usuario escribe el nombre (ej. 'Catacaos' o 'Cata'), lo encuentra y extrae el ubigeo.
 * Si escribe el número (ej. '200105'), también lo encuentra.
 */
export function searchUbigeos(query: string): UbigeoItem[] {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) {
    return UBIGEOS_PIURA.slice(0, 10);
  }

  return UBIGEOS_PIURA.filter(
    (item) =>
      item.district.toLowerCase().includes(clean) ||
      item.province.toLowerCase().includes(clean) ||
      item.code.includes(clean)
  );
}

export function getUbigeoByCode(code: string): UbigeoItem | undefined {
  return UBIGEOS_PIURA.find((item) => item.code === code);
}
