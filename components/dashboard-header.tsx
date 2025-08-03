
import { Droplets, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardHeader({ selectedType, setSelectedType }: { selectedType: "donor" | "patient"; setSelectedType: (type: "donor" | "patient") => void }) {
  return (
    <header className="backdrop-blur-md sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-gray-200 shadow-sm px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-red-200">
          <div className="w-full h-full flex items-center justify-center">
            <Droplets className="h-5 w-5" color="red" />
          </div>
        </div>
        <div>
          <h1 className="text-xl text-red-600 font-medium">Blood General</h1>
        </div>
      </div>
      <div className="ml-auto">
        <Tabs value={selectedType} onValueChange={v => setSelectedType(v as "donor" | "patient")} className="">
          <TabsList className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <TabsTrigger value="donor" className="rounded-md flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Donor</span>
            </TabsTrigger>
            <TabsTrigger value="patient" className="rounded-md flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Patient</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  )
}
