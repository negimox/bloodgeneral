"use client"

import { useState } from "react"
import { Users, Activity, AlertCircle, Calendar, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

type Patient = {
  id: string
  name: string
  age: number
  bloodType: string
  phone: string
  email: string
  severity: "mild" | "moderate" | "severe"
  lastTransfusion: string
  nextAppointment: string
  hemoglobinLevel: number
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "Maria Garcia",
      age: 28,
      bloodType: "B+",
      phone: "+1-555-0125",
      email: "maria.garcia@email.com",
      severity: "moderate",
      lastTransfusion: "2024-02-15",
      nextAppointment: "2024-03-15",
      hemoglobinLevel: 8.5,
    },
    {
      id: "2",
      name: "Ahmed Hassan",
      age: 15,
      bloodType: "A+",
      phone: "+1-555-0126",
      email: "ahmed.hassan@email.com",
      severity: "severe",
      lastTransfusion: "2024-02-28",
      nextAppointment: "2024-03-10",
      hemoglobinLevel: 6.2,
    },
  ])

  const [newPatient, setNewPatient] = useState<{
    name: string
    age: string
    bloodType: string
    phone: string
    email: string
    severity: "mild" | "moderate" | "severe"
    medicalNotes: string
  }>({
    name: "",
    age: "",
    bloodType: "",
    phone: "",
    email: "",
    severity: "mild",
    medicalNotes: "",
  })

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.bloodType) return

    const patient: Patient = {
      id: crypto.randomUUID(),
      name: newPatient.name,
      age: Number.parseInt(newPatient.age),
      bloodType: newPatient.bloodType,
      phone: newPatient.phone,
      email: newPatient.email,
      severity: newPatient.severity,
      lastTransfusion: "Not recorded",
      nextAppointment: "To be scheduled",
      hemoglobinLevel: 0,
    }

    setPatients([...patients, patient])
    setNewPatient({
      name: "",
      age: "",
      bloodType: "",
      phone: "",
      email: "",
      severity: "mild",
      medicalNotes: "",
    })
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
              <CardTitle className="text-blue-800">Patient Registration</CardTitle>
              <CardDescription className="text-gray-600">Add new Thalassemia patients</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patient-name" className="text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="patient-name"
                  placeholder="Enter patient name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age" className="text-gray-700">
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patient-blood-type" className="text-gray-700">
                  Blood Type *
                </Label>
                <Select
                  value={newPatient.bloodType}
                  onValueChange={(value) => setNewPatient({ ...newPatient, bloodType: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="severity" className="text-gray-700">
                  Severity
                </Label>
                <Select
                  value={newPatient.severity}
                  onValueChange={(value: "mild" | "moderate" | "severe") =>
                    setNewPatient({ ...newPatient, severity: value })
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patient-phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="patient-phone"
                  placeholder="+1-555-0123"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patient-email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="patient-email"
                  type="email"
                  placeholder="patient@email.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="medical-notes" className="text-gray-700">
                Medical Notes
              </Label>
              <Textarea
                id="medical-notes"
                placeholder="Additional medical information"
                value={newPatient.medicalNotes}
                onChange={(e) => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button onClick={handleAddPatient} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Activity className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
          <CardTitle className="text-red-800">Patient Records</CardTitle>
          <CardDescription className="text-gray-600">
            {patients.length} patients registered • {patients.filter((p) => p.severity === "severe").length} severe
            cases
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {patients.map((patient) => {
              const hemoglobinStatus = getHemoglobinStatus(patient.hemoglobinLevel)
              return (
                <div
                  key={patient.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <Badge className={`text-xs ${getSeverityColor(patient.severity)}`}>{patient.severity}</Badge>
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          {patient.bloodType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Age: {patient.age} years</p>
                    </div>
                    {patient.hemoglobinLevel > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Hemoglobin</p>
                        <p className={`text-sm font-semibold ${hemoglobinStatus.color}`}>
                          {patient.hemoglobinLevel} g/dL
                        </p>
                        <p className={`text-xs ${hemoglobinStatus.color}`}>{hemoglobinStatus.status}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    {patient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    {patient.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Last transfusion: {patient.lastTransfusion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      <span>Next appointment: {patient.nextAppointment}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
