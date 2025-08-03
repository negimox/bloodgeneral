"use client"

import { useState } from "react"
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
  bloodType: string
  phone: string
  email: string
  address: string
  lastDonation: string
  status: "available" | "unavailable" | "pending"
}

export function DonorRegistration() {
  const [donors, setDonors] = useState<Donor[]>([
    {
      id: "1",
      name: "John Smith",
      bloodType: "O+",
      phone: "+1-555-0123",
      email: "john.smith@email.com",
      address: "123 Main St, City",
      lastDonation: "2024-01-15",
      status: "available",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      bloodType: "A-",
      phone: "+1-555-0124",
      email: "sarah.j@email.com",
      address: "456 Oak Ave, City",
      lastDonation: "2024-02-20",
      status: "unavailable",
    },
  ])

  const [newDonor, setNewDonor] = useState({
    name: "",
    bloodType: "",
    phone: "",
    email: "",
    address: "",
    medicalHistory: "",
  })

  const handleRegisterDonor = () => {
    if (!newDonor.name || !newDonor.bloodType || !newDonor.phone) return

    const donor: Donor = {
      id: crypto.randomUUID(),
      name: newDonor.name,
      bloodType: newDonor.bloodType,
      phone: newDonor.phone,
      email: newDonor.email,
      address: newDonor.address,
      lastDonation: "Never",
      status: "available",
    }

    setDonors([...donors, donor])
    setNewDonor({
      name: "",
      bloodType: "",
      phone: "",
      email: "",
      address: "",
      medicalHistory: "",
    })
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
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="donor-name" className="text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="donor-name"
                  placeholder="Enter full name"
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blood-type" className="text-gray-700">
                  Blood Type *
                </Label>
                <Select
                  value={newDonor.bloodType}
                  onValueChange={(value) => setNewDonor({ ...newDonor, bloodType: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-red-500">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0123"
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="donor@email.com"
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Full address"
                value={newDonor.address}
                onChange={(e) => setNewDonor({ ...newDonor, address: e.target.value })}
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="medical-history" className="text-gray-700">
                Medical History
              </Label>
              <Textarea
                id="medical-history"
                placeholder="Any relevant medical information"
                value={newDonor.medicalHistory}
                onChange={(e) => setNewDonor({ ...newDonor, medicalHistory: e.target.value })}
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <Button onClick={handleRegisterDonor} className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Heart className="mr-2 h-4 w-4" />
              Register Donor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50">
          <CardTitle className="text-blue-800">Registered Donors</CardTitle>
          <CardDescription className="text-gray-600">
            {donors.length} donors registered • {donors.filter((d) => d.status === "available").length} available
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {donors.map((donor) => (
              <div key={donor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(donor.status)}`}>{donor.status}</Badge>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {donor.bloodType}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{donor.phone}</span>
                      </div>
                      {donor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{donor.email}</span>
                        </div>
                      )}
                      {donor.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{donor.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Last donation: {donor.lastDonation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
