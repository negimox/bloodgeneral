"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonorRegistration } from "@/components/donor-registration"
import { HostCampForm } from "@/components/host-camp-form"
import { PatientManagement } from "@/components/patient-management"
import { BloodStock } from "@/components/blood-stock"
import { Appointments } from "@/components/appointments"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { Droplets, CalendarIcon, User2, UserPlus2 } from "lucide-react"


export default function Home() {
  const [selectedType, setSelectedType] = useState<"donor" | "patient">("donor")
  const [activeTab, setActiveTab] = useState<string>(selectedType === "donor" ? "donor-registration" : "patient-management")

  // Update activeTab when selectedType changes
  useEffect(() => {
    setActiveTab(selectedType === "donor" ? "donor-registration" : "patient-management")
  }, [selectedType])

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <DashboardHeader selectedType={selectedType} setSelectedType={setSelectedType} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardStats />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex flex-row w-fit mx-auto rounded-lg p-1 shadow-sm">
              <TabsTrigger value={selectedType === "donor" ? "donor-registration" : "patient-management"} className="rounded-md flex items-center gap-2">
                {selectedType === "donor" ? <UserPlus2 className="h-4 w-4" /> : <User2 className="h-4 w-4" />}
                <span className="hidden sm:inline">{selectedType === "donor" ? "Donor Registration" : "Thalassemia Patients Registration"}</span>
              </TabsTrigger>
              {selectedType === "donor" && (
                <TabsTrigger value="host-camp" className="rounded-md flex items-center gap-2 data-[state=active]:text-green-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Host a Camp</span>
                </TabsTrigger>
              )}
              {selectedType === "donor" && (
                <TabsTrigger value="camp-schedule" className="rounded-md flex items-center gap-2 data-[state=active]:text-blue-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Camp Schedule</span>
                </TabsTrigger>
              )}
              
              <TabsTrigger value="blood-stock" className="rounded-md flex items-center gap-2 data-[state=active]:text-red-600">
                <Droplets className="h-4 w-4" />
                <span className="hidden sm:inline">Blood Stock</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donor-registration" className="space-y-4">
              {selectedType === "donor" && <DonorRegistration />}
            </TabsContent>
            <TabsContent value="patient-management" className="space-y-4">
              {selectedType === "patient" && <PatientManagement />}
            </TabsContent>
            <TabsContent value="camp-schedule" className="space-y-4">
              {selectedType === "donor" && <Appointments />}
            </TabsContent>
            <TabsContent value="host-camp" className="space-y-4">
              {selectedType === "donor" && (
                <HostCampForm />
              )}
            </TabsContent>
            <TabsContent value="blood-stock" className="space-y-4">
              <BloodStock selectedType={selectedType} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
