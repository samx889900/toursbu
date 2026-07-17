"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { autoAllocateRoomsAction, autoAllocateBusesAction } from "@/actions/admin-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Users, Bus, Bed, AlertCircle, CheckCircle2 } from "lucide-react";

export function AllocationsClient({ trips }: { trips: any[] }) {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"rooms" | "buses">("rooms");
  const [isAllocating, setIsAllocating] = useState(false);
  const router = useRouter();

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  const handleAutoAllocate = async () => {
    if (!selectedTripId) return;
    try {
      setIsAllocating(true);
      let res;
      if (activeTab === "rooms") {
        res = await autoAllocateRoomsAction(selectedTripId);
      } else {
        res = await autoAllocateBusesAction(selectedTripId);
      }
      toast.success(`Successfully allocated ${res.allocated} travelers`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to auto-allocate");
    } finally {
      setIsAllocating(false);
    }
  };

  if (!selectedTrip) {
    return <div className="p-8 text-center text-gray-500">No upcoming trips available for allocation.</div>;
  }

  const allTravelers = selectedTrip.bookings.flatMap((b: any) => b.travelers);
  const unallocatedRooms = allTravelers.filter((t: any) => !t.roomAllocation);
  const unallocatedBuses = allTravelers.filter((t: any) => !t.busAllocation);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Allocations"
        description="Manage room and bus assignments."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Allocations" },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <Select value={selectedTripId} onValueChange={setSelectedTripId}>
              <SelectTrigger className="w-[250px] bg-white">
                <SelectValue placeholder="Select Trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAutoAllocate} disabled={isAllocating} className="bg-[var(--tbu-blue)] text-white">
              {isAllocating ? "Allocating..." : `Auto Allocate ${activeTab === 'rooms' ? 'Rooms' : 'Buses'}`}
            </Button>
          </div>
        }
      />

      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "rooms" ? "border-[var(--tbu-blue)] text-[var(--tbu-blue)]" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Bed className="w-4 h-4" /> Rooms
        </button>
        <button
          onClick={() => setActiveTab("buses")}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "buses" ? "border-[var(--tbu-blue)] text-[var(--tbu-blue)]" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          <Bus className="w-4 h-4" /> Buses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border shadow-sm h-fit">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" /> Unallocated
          </h3>
          {activeTab === "rooms" ? (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {unallocatedRooms.map((t: any) => (
                <div key={t.id} className="p-3 border rounded-lg text-sm bg-gray-50">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.gender}</p>
                </div>
              ))}
              {unallocatedRooms.length === 0 && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> All travelers allocated</p>}
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {unallocatedBuses.map((t: any) => (
                <div key={t.id} className="p-3 border rounded-lg text-sm bg-gray-50">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.gender}</p>
                </div>
              ))}
              {unallocatedBuses.length === 0 && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> All travelers allocated</p>}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {activeTab === "rooms" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {selectedTrip.rooms.map((room: any) => (
                <div key={room.id} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h4 className="font-bold">Room {room.roomNumber}</h4>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                      {room.allocations.length} / {room.capacity}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {room.allocations.map((a: any) => (
                      <div key={a.id} className="text-sm p-2 bg-blue-50/50 rounded flex justify-between items-center">
                        <span>{a.traveler.name}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{a.traveler.gender}</span>
                      </div>
                    ))}
                    {room.allocations.length === 0 && <p className="text-xs text-gray-400">Empty</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedTrip.buses.map((bus: any) => (
                <div key={bus.id} className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h4 className="font-bold">Bus {bus.busNumber}</h4>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                      {bus.allocations.length} / {bus.capacity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {bus.allocations.map((a: any) => (
                      <div key={a.id} className="text-xs p-2 bg-blue-50/50 rounded flex flex-col">
                        <span className="font-medium truncate">{a.traveler.name}</span>
                        <span className="text-[10px] text-gray-500">{a.seatNumber || "No Seat"}</span>
                      </div>
                    ))}
                    {bus.allocations.length === 0 && <p className="text-xs text-gray-400">Empty</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
