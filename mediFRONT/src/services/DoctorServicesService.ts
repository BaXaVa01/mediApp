import { apiFetch } from '../lib/api';

export type DoctorServiceResponse = {
  id: string;
  doctorId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  locationId?: string | null;
  locationName?: string | null;
  clinicId?: string | null;
  clinicName?: string | null;
  active: boolean;
};

export type DoctorServicesListResponse = {
  doctorId: string;
  services: DoctorServiceResponse[];
};

export type CreateDoctorServiceRequest = {
  doctorId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  locationId?: string | null;
  clinicId?: string | null;
};

export type UpdateDoctorServiceRequest = {
  doctorId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  locationId?: string | null;
  clinicId?: string | null;
  active: boolean;
};

export type DeleteDoctorServiceResponse = {
  id: string;
  doctorId: string;
  active: boolean;
  message: string;
};

class DoctorServicesService {
  async getDoctorServices(doctorId: string, includeInactive = false): Promise<DoctorServicesListResponse> {
    return apiFetch<DoctorServicesListResponse>(
      `/api/doctor/services?doctorId=${encodeURIComponent(doctorId)}&includeInactive=${includeInactive}`
    );
  }

  async getDoctorServiceDetail(serviceId: string, doctorId: string): Promise<DoctorServiceResponse> {
    return apiFetch<DoctorServiceResponse>(
      `/api/doctor/services/${encodeURIComponent(serviceId)}?doctorId=${encodeURIComponent(doctorId)}`
    );
  }

  async createDoctorService(payload: CreateDoctorServiceRequest): Promise<DoctorServiceResponse> {
    return apiFetch<DoctorServiceResponse>('/api/doctor/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateDoctorService(serviceId: string, payload: UpdateDoctorServiceRequest): Promise<DoctorServiceResponse> {
    return apiFetch<DoctorServiceResponse>(`/api/doctor/services/${encodeURIComponent(serviceId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteDoctorService(serviceId: string, doctorId: string): Promise<DeleteDoctorServiceResponse> {
    return apiFetch<DeleteDoctorServiceResponse>(
      `/api/doctor/services/${encodeURIComponent(serviceId)}?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: 'DELETE',
      }
    );
  }
}

export const doctorServicesService = new DoctorServicesService();

export function getServiceErrorMessage(error: any): string {
  const code = error?.code || error?.response?.data?.error;
  switch (code) {
    case "INVALID_SERVICE_NAME":
      return "El nombre del servicio no es válido. Debe tener entre 3 y 150 caracteres.";
    case "INVALID_DURATION":
      return "La duración del servicio no es válida. Debe ser mayor a 0.";
    case "INVALID_PRICE":
      return "El precio del servicio no es válido. Debe ser mayor o igual a 0.";
    case "INVALID_LOCATION":
      return "El lugar seleccionado ya no está disponible. Actualizá tus lugares de atención.";
    case "SERVICE_NOT_FOUND":
      return "Este servicio ya no existe o fue modificado.";
    case "RESOURCE_NOT_OWNED":
      return "No podés modificar servicios de otro usuario.";
    case "UNAUTHORIZED":
      return "Tu sesión expiró. Iniciá sesión nuevamente.";
    case "FORBIDDEN":
      return "No tenés permisos para administrar estos servicios.";
    case "VALIDATION_ERROR":
      return "Revisá los datos del servicio e intentá nuevamente.";
    case "NETWORK_ERROR":
      return "No pudimos conectar con el servidor. Revisá tu conexión.";
    default:
      return error?.message || "No pudimos guardar el servicio. Intentá nuevamente.";
  }
}
