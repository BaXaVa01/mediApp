import { AgendaFilterPanel } from '../../components/professional/agenda/AgendaFilterPanel';
import { CalendarGrid } from '../../components/professional/agenda/CalendarGrid';
import { AppointmentDetailPanel } from '../../components/professional/agenda/AppointmentDetailPanel';
import { PendingRequestsDrawer } from '../../components/professional/agenda/PendingRequestsDrawer';
import { RescheduleModal } from '../../components/professional/agenda/RescheduleModal';

export default function AgendaPage() {
  return (
    <div className="h-[100vh] flex bg-[#FDF9F3] overflow-hidden">
      <AgendaFilterPanel />
      <div className="flex-1 bg-white flex flex-col border-x border-[#1C365C]/5 shadow-[0_0_40px_rgba(28,54,92,0.02)] z-10 relative">
        <CalendarGrid />
      </div>
      <AppointmentDetailPanel />
      
      {/* Overlays */}
      <PendingRequestsDrawer />
      <RescheduleModal />
    </div>
  );
}
