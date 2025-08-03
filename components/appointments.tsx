"use client"

import { useState } from "react"
import { useAllStates } from "@/hooks/useAllStates"
import { useDistricts } from "@/hooks/useDistricts"
// import { format } from "date-fns" (already imported above)
import { Calendar as CalendarIcon, Clock, Phone, AlertCircle, CheckCircle, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"

type Appointment = {
  id: string
  patientName: string
  patientPhone: string
  appointmentType: "transfusion" | "consultation" | "checkup"
  date: string
  time: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  notes: string
  bloodType: string
}

export function Appointments() {
  // Camp search form state
  const [searchForm, setSearchForm] = useState({
    state: "",
    district: "-1", // Default to All Districts
    date: new Date(),
  })
  // Popover open state for date picker
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [errorSearch, setErrorSearch] = useState<string | null>(null)

  // Fetch states and districts
  const { data: states, loading: loadingStates, error: errorStates } = useAllStates()
  const selectedState = searchForm.state
  const { data: districts, loading: loadingDistricts, error: errorDistricts } = useDistricts(Number(selectedState) || 0)

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Maria Garcia",
      patientPhone: "+1-555-0125",
      appointmentType: "transfusion",
      date: "2024-03-15",
      time: "10:00",
      status: "confirmed",
      notes: "Regular monthly transfusion",
      bloodType: "B+"
    },
    {
      id: "2",
      patientName: "Ahmed Hassan",
      patientPhone: "+1-555-0126",
      appointmentType: "transfusion",
      date: "2024-03-10",
      time: "14:30",
      status: "scheduled",
      notes: "Urgent transfusion needed",
      bloodType: "A+"
    },
    {
      id: "3",
      patientName: "Sarah Johnson",
      patientPhone: "+1-555-0127",
      appointmentType: "consultation",
      date: "2024-03-12",
      time: "09:00",
      status: "completed",
      notes: "Follow-up consultation",
      bloodType: "O-"
    }
  ])

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    appointmentType: "transfusion" as const,
    date: "",
    time: "",
    notes: "",
    bloodType: "",
  })

  const handleScheduleAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) return

    const appointment: Appointment = {
      id: crypto.randomUUID(),
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      appointmentType: newAppointment.appointmentType,
      date: newAppointment.date,
      time: newAppointment.time,
      status: "scheduled",
      notes: newAppointment.notes,
      bloodType: newAppointment.bloodType,
    }

    setAppointments([...appointments, appointment])
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      appointmentType: "transfusion",
      date: "",
      time: "",
      notes: "",
      bloodType: "",
    })
  }

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "transfusion":
        return "bg-red-100 text-red-800 border-red-200"
      case "consultation":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "checkup":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const todayAppointments = appointments.filter((apt) => apt.date === format(new Date(), "yyyy-MM-dd"))
  const upcomingAppointments = appointments.filter((apt) => new Date(apt.date) > new Date())

  return (
    <div className="grid gap-6">
      {/* Camp Search Form */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50">
          <CardTitle className="text-blue-800">Search Nearby Camps</CardTitle>
          <CardDescription className="text-gray-600">Find blood donation camps by location and date</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={async e => {
            e.preventDefault();
            setLoadingSearch(true);
            setErrorSearch(null);
            setSearchResults([]);
            try {
              const { fetchNearbyCamps } = await import("@/lib/api");
              const campDateStr = searchForm.date ? format(searchForm.date, "yyyy-MM-dd") : "";
              const data = await fetchNearbyCamps({
                stateCode: searchForm.state,
                districtCode: searchForm.district,
                campDate: campDateStr,
              });
              setSearchResults(Array.isArray(data?.data) ? data.data : []);
            } catch (err: any) {
              setErrorSearch(err.message || "Failed to fetch camps");
            } finally {
              setLoadingSearch(false);
            }
          }}>
            {/* State */}
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                value={searchForm.state}
                onValueChange={val => setSearchForm(f => ({ ...f, state: val }))}
                disabled={loadingStates || !!errorStates}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(states?.data) ? states.data : Array.isArray(states?.states) ? states.states : Array.isArray(states) ? states : []).map((state: any) => (
                    <SelectItem key={state.stateCode} value={state.stateCode.toString()}>{state.stateName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* District */}
            <div>
              <Label htmlFor="district">District</Label>
              <Select
                value={searchForm.district}
                onValueChange={val => setSearchForm(f => ({ ...f, district: val }))}
                disabled={!districts || !Array.isArray(districts.records) || loadingDistricts || !!errorDistricts}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">All Districts</SelectItem>
                  {Array.isArray(districts?.records) && districts.records.map((district: any) => (
                    <SelectItem key={district.value} value={district.value}>{district.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Date Picker - shadcn controlled popover */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    data-empty={!searchForm.date}
                    className={cn(
                      "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchForm.date ? format(searchForm.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={searchForm.date}
                    onSelect={date => {
                      if (date) {
                        setSearchForm(f => ({ ...f, date }))
                        setDatePickerOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loadingSearch}>
              {loadingSearch ? "Searching..." : "Search"}
            </Button>
          </form>
          {/* Results */}
          <div className="mt-6">
            {loadingSearch && <div className="text-blue-600">Searching for camps...</div>}
            {errorSearch && <div className="text-red-600">{errorSearch}</div>}
            {!loadingSearch && !errorSearch && searchResults.length === 0 && <div className="text-gray-500">No camps found for selected filters.</div>}
            {searchResults.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2 text-left">S/N</th>
                      <th className="px-4 py-2 text-left">Camp Name</th>
                      <th className="px-4 py-2 text-left">Address</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((camp: any, idx: number) => (
                      <tr key={camp[0] || idx} className="border-b">
                        <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                        <td className="px-4 py-2">{camp[1]}</td>
                        <td className="px-4 py-2">{camp[2]}</td>
                        <td className="px-4 py-2">{camp[3]}</td>
                        <td className="px-4 py-2">{camp[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    
     
    </div>
  )
}
