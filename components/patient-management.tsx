"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fetchAllStates, fetchDistricts } from "@/lib/api"
import { Users, Activity, AlertCircle, Calendar, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

type Receiver = {
  id: string
  name: string
  dob: string
  address: string
  state: string
  district: string
  thalassemiaType: "alpha" | "beta"
  bloodGroup: string
  bloodComponent: string
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Receiver[]>([])
  const [isFilled, setIsFilled] = useState(false)

  const [newPatient, setNewPatient] = useState<{
    name: string
    dob: string
    address: string
    state: string
    district: string
    thalassemiaType: "alpha" | "beta"
    bloodGroup: string
    bloodComponent: string
  }>({
    name: "",
    dob: "",
    address: "",
    state: "",
    district: "",
    thalassemiaType: "alpha",
    bloodGroup: "",
    bloodComponent: "11",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [errorStates, setErrorStates] = useState<string | null>(null)
  const [errorDistricts, setErrorDistricts] = useState<string | null>(null)

  useEffect(() => {
    setLoadingStates(true)
    fetchAllStates()
      .then((res) => {
        let arr = Array.isArray(res?.data) ? res.data : Array.isArray(res?.states) ? res.states : Array.isArray(res) ? res : []
        setStates(arr)
      })
      .catch(() => setErrorStates("Failed to fetch states"))
      .finally(() => setLoadingStates(false))
    // Check localStorage for filled status
    const stored = typeof window !== "undefined" ? localStorage.getItem("thalassemia_patients") : null
    if (stored && stored !== "[]" && stored !== "" && stored !== null) {
      setIsFilled(true)
    } else {
      setIsFilled(false)
    }
  }, [])

  useEffect(() => {
    if (!newPatient.state) {
      setDistricts([])
      return
    }
    setLoadingDistricts(true)
    fetchDistricts(Number(newPatient.state))
      .then((res) => {
        let arr = Array.isArray(res?.records) ? res.records : []
        setDistricts(arr)
      })
      .catch(() => setErrorDistricts("Failed to fetch districts"))
      .finally(() => setLoadingDistricts(false))
  }, [newPatient.state])

  const handleAddPatient = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newPatient.name || !newPatient.dob || !newPatient.address || !newPatient.state || !newPatient.district || !newPatient.thalassemiaType || !newPatient.bloodGroup || !newPatient.bloodComponent) return
    const patient: Receiver = {
      id: crypto.randomUUID(),
      name: newPatient.name,
      dob: newPatient.dob,
      address: newPatient.address,
      state: newPatient.state,
      district: newPatient.district,
      thalassemiaType: newPatient.thalassemiaType,
      bloodGroup: newPatient.bloodGroup,
      bloodComponent: newPatient.bloodComponent,
    }
    const updatedPatients = [...patients, patient]
    setPatients(updatedPatients)
    localStorage.setItem("thalassemia_patients", JSON.stringify(updatedPatients))
    setFormSubmitted(true)
    setIsFilled(true)
    setNewPatient({
      name: "",
      dob: "",
      address: "",
      state: "",
      district: "",
      thalassemiaType: "alpha",
      bloodGroup: "",
      bloodComponent: "11",
    })
    setTimeout(() => setFormSubmitted(false), 2000)
  }

  const handleReset = () => {
    localStorage.removeItem("thalassemia_patients")
    setPatients([])
    setIsFilled(false)
    setFormSubmitted(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHemoglobinStatus = (level: number) => {
    if (level < 7) return { color: "text-red-600", status: "Critical" }
    if (level < 9) return { color: "text-yellow-600", status: "Low" }
    return { color: "text-green-600", status: "Stable" }
  }

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-800">Thalassemia Patient Registration</CardTitle>
              <CardDescription className="text-gray-600">Add new Thalassemia patient</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!isFilled ? (
            <form className="grid gap-4" onSubmit={handleAddPatient}>
              {/* ...existing code for form fields and submit button... */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter patient name"
                    value={newPatient.name}
                    onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob" className="text-gray-700">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newPatient.dob}
                    onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-gray-700">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={newPatient.address}
                    onChange={e => setNewPatient({ ...newPatient, address: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state" className="text-gray-700">State *</Label>
                  <Select
                    value={newPatient.state}
                    onValueChange={val => setNewPatient({ ...newPatient, state: val, district: "" })}
                    disabled={loadingStates || !!errorStates}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.stateCode} value={state.stateCode.toString()}>{state.stateName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="district" className="text-gray-700">District *</Label>
                  <Select
                    value={newPatient.district}
                    onValueChange={val => setNewPatient({ ...newPatient, district: val })}
                    disabled={!districts.length || loadingDistricts || !!errorDistricts}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district: any) => (
                        <SelectItem key={district.value} value={district.value}>{district.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thalassemia-type" className="text-gray-700">Type of Thalassemia *</Label>
                  <Select
                    value={newPatient.thalassemiaType}
                    onValueChange={val => setNewPatient({ ...newPatient, thalassemiaType: val as "alpha" | "beta" })}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alpha">Alpha Thalassemia</SelectItem>
                      <SelectItem value="beta">Beta Thalassemia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="blood-group" className="text-gray-700">Blood Group *</Label>
                  <Select
                    value={newPatient.bloodGroup}
                    onValueChange={val => setNewPatient({ ...newPatient, bloodGroup: val })}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18">AB-Ve</SelectItem>
                      <SelectItem value="17">AB+Ve</SelectItem>
                      <SelectItem value="12">A-Ve</SelectItem>
                      <SelectItem value="11">A+Ve</SelectItem>
                      <SelectItem value="14">B-Ve</SelectItem>
                      <SelectItem value="13">B+Ve</SelectItem>
                      <SelectItem value="23">Oh-VE</SelectItem>
                      <SelectItem value="22">Oh+VE</SelectItem>
                      <SelectItem value="16">O-Ve</SelectItem>
                      <SelectItem value="15">O+Ve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blood-component" className="text-gray-700">Blood Component Required *</Label>
                  <Select
                    value={newPatient.bloodComponent}
                    onValueChange={val => setNewPatient({ ...newPatient, bloodComponent: val })}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select blood component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11">Whole Blood</SelectItem>
                      <SelectItem value="14">Single Donor Platelet</SelectItem>
                      <SelectItem value="18">Single Donor Plasma</SelectItem>
                      <SelectItem value="28">Sagm Packed Red Blood Cells</SelectItem>
                      <SelectItem value="23">Random Donor Platelets</SelectItem>
                      <SelectItem value="16">Platelet Rich Plasma</SelectItem>
                      <SelectItem value="20">Platelet Concentrate</SelectItem>
                      <SelectItem value="19">Plasma</SelectItem>
                      <SelectItem value="12">Packed Red Blood Cells</SelectItem>
                      <SelectItem value="30">Leukoreduced Rbc</SelectItem>
                      <SelectItem value="29">Irradiated RBC</SelectItem>
                      <SelectItem value="13">Fresh Frozen Plasma</SelectItem>
                      <SelectItem value="17">Cryoprecipitate</SelectItem>
                      <SelectItem value="21">Cryo Poor Plasma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Activity className="mr-2 h-4 w-4" />
                Submit
              </Button>
              {formSubmitted && (
                <div className="text-green-600 text-center font-semibold mt-2">Form Submitted</div>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-green-600 text-center font-semibold">Form Submitted</div>
              <Button variant="outline" onClick={handleReset} className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50">Reset Form</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
