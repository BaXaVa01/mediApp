export function getDoctorAppointmentErrorMessage(error: any): string {
  const code = error?.code || error?.response?.data?.error;
  switch (code) {
    case "APPOINTMENT_NOT_FOUND":
      return "La cita ya no existe o fue modificada.";
    case "APPOINTMENT_NOT_OWNED_BY_DOCTOR":
      return "No podés modificar una cita que no pertenece a tu cuenta.";
    case "APPOINTMENT_NOT_PENDING":
      return "Esta cita ya no está pendiente.";
    case "APPOINTMENT_ALREADY_PASSED":
      return "No podés aceptar o rechazar una cita que ya pasó.";
    case "INVALID_DECISION":
      return "No se pudo procesar la decisión. Intentá nuevamente.";
    case "UNAUTHORIZED":
      return "Tu sesión expiró. Iniciá sesión nuevamente.";
    case "FORBIDDEN":
      return "No tenés permisos para ver esta agenda.";
    case "NETWORK_ERROR":
      return "No pudimos conectar con el servidor. Revisá tu conexión.";
    default:
      return error?.message || "No pudimos procesar la solicitud. Intentá nuevamente.";
  }
}
