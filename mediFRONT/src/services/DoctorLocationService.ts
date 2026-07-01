import { apiFetch } from '../lib/api';

export interface DoctorLocationDTO {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
  clinicId?: string | null;
  clinicName?: string;
  isMain: boolean;
  active: boolean;
}

export interface CreateDoctorLocationRequest {
  doctorId: string;
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
  type: string; // "PRESENCIAL", "ONLINE", "DOMICILIO"
  isMain: boolean;
}

export interface UpdateDoctorLocationRequest {
  doctorId: string;
  name: string;
  address?: string;
  city?: string;
  latitude: number;
  longitude: number;
  type: string;
  isMain: boolean;
  active: boolean;
}

class DoctorLocationService {
  async getDoctorLocations(doctorId: string): Promise<DoctorLocationDTO[]> {
    return apiFetch<DoctorLocationDTO[]>(
      `/api/doctor/locations?doctorId=${encodeURIComponent(doctorId)}`
    );
  }

  async createDoctorLocation(payload: CreateDoctorLocationRequest): Promise<DoctorLocationDTO> {
    return apiFetch<DoctorLocationDTO>('/api/doctor/locations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateDoctorLocation(locationId: string, payload: UpdateDoctorLocationRequest): Promise<DoctorLocationDTO> {
    return apiFetch<DoctorLocationDTO>(`/api/doctor/locations/${encodeURIComponent(locationId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteDoctorLocation(locationId: string, doctorId: string): Promise<void> {
    await apiFetch<void>(
      `/api/doctor/locations/${encodeURIComponent(locationId)}?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  async setMainDoctorLocation(locationId: string, doctorId: string): Promise<void> {
    await apiFetch<void>(
      `/api/doctor/locations/${encodeURIComponent(locationId)}/main`,
      {
        method: 'PATCH',
        body: JSON.stringify({ doctorId }),
      }
    );
  }
}

export const doctorLocationService = new DoctorLocationService();

export function getLocationErrorMessage(error: any): string {
  const code = error?.code || error?.response?.data?.error;
  switch (code) {
    case "INVALID_COORDINATES":
      return "Las coordenadas seleccionadas no son válidas.";
    case "INVALID_LOCATION_TYPE":
      return "El tipo de lugar no es válido.";
    case "LOCATION_NOT_FOUND":
      return "Este lugar ya no existe o no pertenece a tu cuenta.";
    case "RESOURCE_NOT_OWNED":
      return "No podés modificar recursos de otro usuario.";
    case "UNAUTHORIZED":
      return "Tu sesión expiró. Iniciá sesión nuevamente.";
    case "FORBIDDEN":
      return "No tenés permisos para realizar esta acción.";
    case "NETWORK_ERROR":
      return "No pudimos conectar con el servidor. Revisá tu conexión.";
    default:
      return error?.message || "No pudimos guardar el lugar de atención. Intentá nuevamente.";
  }
}
