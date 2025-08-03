"use client"

import { useEffect, useState } from "react"
import { UserPlus, Heart, Phone, Mail, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type Donor = {
  id: string
  name: string
  dob: string
  address: string
  
  state: string
  district: string
  bloodGroup: string
  medicalHistory?: string
}
export function DonorRegistration() {
  const [newDonor, setNewDonor] = useState({
    name: "",
    dob: "",
    address: "",
    state: "",
    district: "",
    bloodGroup: "",
    medicalHistory: "",
  })
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [errorStates, setErrorStates] = useState<string | null>(null)
  const [errorDistricts, setErrorDistricts] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  useEffect(() => {
    setLoadingStates(true)
    import("@/lib/api").then(({ fetchAllStates }) => {
      fetchAllStates()
        .then((res: any) => {
          let arr = Array.isArray(res?.data) ? res.data : Array.isArray(res?.states) ? res.states : Array.isArray(res) ? res : []
          setStates(arr)
        })
        .catch(() => setErrorStates("Failed to fetch states"))
        .finally(() => setLoadingStates(false))
    })
    // Check localStorage for filled status
    const stored = typeof window !== "undefined" ? localStorage.getItem("donor_information") : null
    if (stored && stored !== "[]" && stored !== "" && stored !== null) {
      setIsFilled(true)
    } else {
      setIsFilled(false)
    }
  }, [])

  useEffect(() => {
    if (!newDonor.state) {
      setDistricts([])
      return
    }
    setLoadingDistricts(true)
    import("@/lib/api").then(({ fetchDistricts }) => {
      fetchDistricts(Number(newDonor.state))
        .then((res: any) => {
          let arr = Array.isArray(res?.records) ? res.records : []
          setDistricts(arr)
        })
        .catch(() => setErrorDistricts("Failed to fetch districts"))
        .finally(() => setLoadingDistricts(false))
    })
  }, [newDonor.state])

  const handleRegisterDonor = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newDonor.name || !newDonor.dob || !newDonor.address || !newDonor.state || !newDonor.district || !newDonor.bloodGroup) return
    const donor: Donor = {
      id: crypto.randomUUID(),
      name: newDonor.name,
      dob: newDonor.dob,
      address: newDonor.address,
      state: newDonor.state,
      district: newDonor.district,
      bloodGroup: newDonor.bloodGroup,
      medicalHistory: newDonor.medicalHistory,
    }
    localStorage.setItem("donor_information", JSON.stringify(donor))
    setFormSubmitted(true)
    setIsFilled(true)
    setNewDonor({
      name: "",
      dob: "",
      address: "",
      state: "",
      district: "",
      bloodGroup: "",
      medicalHistory: "",
    })
    setTimeout(() => setFormSubmitted(false), 2000)
  }

  const handleReset = () => {
    localStorage.removeItem("donor_information")
    setIsFilled(false)
    setFormSubmitted(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <UserPlus className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800">Donor Registration</CardTitle>
              <CardDescription className="text-gray-600">Register new blood donors</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!isFilled ? (
            <form className="grid gap-4" onSubmit={handleRegisterDonor}>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="donor-name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="donor-name"
                    placeholder="Enter full name"
                    value={newDonor.name}
                    onChange={e => setNewDonor({ ...newDonor, name: e.target.value })}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob" className="text-gray-700">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newDonor.dob}
                    onChange={e => setNewDonor({ ...newDonor, dob: e.target.value })}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                    value={newDonor.address}
                    onChange={e => setNewDonor({ ...newDonor, address: e.target.value })}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state" className="text-gray-700">State *</Label>
                  <Select
                    value={newDonor.state}
                    onValueChange={val => setNewDonor({ ...newDonor, state: val, district: "" })}
                    disabled={loadingStates || !!errorStates}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-red-500">
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
                    value={newDonor.district}
                    onValueChange={val => setNewDonor({ ...newDonor, district: val })}
                    disabled={!districts.length || loadingDistricts || !!errorDistricts}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-red-500">
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
                  <Label htmlFor="blood-group" className="text-gray-700">Blood Group *</Label>
                  <Select
                    value={newDonor.bloodGroup}
                    onValueChange={val => setNewDonor({ ...newDonor, bloodGroup: val })}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-red-500">
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medical-history" className="text-gray-700">Medical History (optional)</Label>
                <Textarea
                  id="medical-history"
                  placeholder="Any relevant medical information"
                  value={newDonor.medicalHistory}
                  onChange={e => setNewDonor({ ...newDonor, medicalHistory: e.target.value })}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Heart className="mr-2 h-4 w-4" />
                Register
              </Button>
              {formSubmitted && (
                <div className="text-green-600 text-center font-semibold mt-2">Form Submitted</div>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-green-600 text-center font-semibold">Form Submitted</div>
              <Button variant="outline" onClick={handleReset} className="bg-white border border-red-600 text-red-600 hover:bg-red-50">Reset Form</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
