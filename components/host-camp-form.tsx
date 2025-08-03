"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

const organizationTypes = [
  { value: "0", label: "Select value" },
  { value: "1", label: "Blood Warriors" },
  { value: "2", label: "Sewa hi Sangathan- Health Volunteers" },
  { value: "3", label: "Red Cross" },
  { value: "4", label: "RWA" },
  { value: "5", label: "Others" },
]

const bloodBanks = [
  { id: "Bongaigaon Civil Hospital Bongaigaon", value: "4001" },
  { id: "Lower Assam Hospital Blood Centre Chapaguri", value: "4031" },
  { id: "Swagat Hospital Blood Centre Bongaigaon", value: "283357" },
]

export function HostCampForm() {
  // Helper to format date as DD-MMM-YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const [form, setForm] = useState({
    organizationType: "0",
    organizationName: "",
    organizerName: "",
    organizerMobile: "",
    organizerEmail: "",
    campName: "",
    campAddress: "",
    state: "",
    district: "",
    bloodBank: "",
    campDate: "",
    startTime: "",
    endTime: "",
  })
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [bloodBanks, setBloodBanks] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingBloodBanks, setLoadingBloodBanks] = useState(false)
  const [errorStates, setErrorStates] = useState<string | null>(null)
  const [errorDistricts, setErrorDistricts] = useState<string | null>(null)
  const [errorBloodBanks, setErrorBloodBanks] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

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
  }, [])

  useEffect(() => {
    if (!form.state) {
      setDistricts([])
      return
    }
    setLoadingDistricts(true)
    import("@/lib/api").then(({ fetchDistricts }) => {
      fetchDistricts(Number(form.state))
        .then((res: any) => {
          let arr = Array.isArray(res?.records) ? res.records : []
          setDistricts(arr)
        })
        .catch(() => setErrorDistricts("Failed to fetch districts"))
        .finally(() => setLoadingDistricts(false))
    })
  }, [form.state])

  // Fetch blood banks when district is selected
  useEffect(() => {
    if (!form.state || !form.district) {
      setBloodBanks([])
      return
    }
    setLoadingBloodBanks(true)
    import("@/lib/api").then(({ fetchBloodBanks }) => {
      fetchBloodBanks({ stateCode: form.state, districtCode: form.district })
        .then((res: any) => {
          let arr = Array.isArray(res?.records) ? res.records : []
          setBloodBanks(arr)
        })
        .catch(() => setErrorBloodBanks("Failed to fetch blood banks"))
        .finally(() => setLoadingBloodBanks(false))
    })
  }, [form.state, form.district])

  // Helper to disable past dates
  const getToday = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // Validation
    if (
      form.organizationType === "0" ||
      !form.organizationName ||
      !form.organizerName ||
      !form.organizerMobile ||
      !form.organizerEmail ||
      !form.campName ||
      !form.campAddress ||
      !form.state ||
      !form.district ||
      !form.bloodBank ||
      !form.campDate ||
      !form.startTime ||
      !form.endTime
    ) return
    // Format for localStorage
    const formattedDate = formatDate(form.campDate);
    const campInfo = [
      "1",
      `${formattedDate}<label for='checkbox-for-1'> <div id='1' onmouseover='AddCalander(this)'  class='calShare'><i  class='fa fa-calendar'></i></div></label>`,
      form.campName,
      `${bloodBanks.find(b => b.value === form.bloodBank)?.id || ""}, ${states.find(s => s.stateCode.toString() === form.state)?.stateName || ""}, ${districts.find(d => d.value === form.district)?.id || ""}`,
      states.find(s => s.stateCode.toString() === form.state)?.stateName || "",
      districts.find(d => d.value === form.district)?.id || "",
      form.organizerMobile,
      form.organizationName,
      form.organizerName,
      "<a href='/BLDAHIMS/bloodbank/portalDonorRegistrationNew.cnt?&campid=1143553&type=0' target='_blank'>Register <br> as Voluntary <br>Donor</a>",
      `${form.startTime}-${form.endTime}`,
    ]
    localStorage.setItem("hosted_camp_information", JSON.stringify(campInfo))
    setFormSubmitted(true)
    setForm({
      organizationType: "0",
      organizationName: "",
      organizerName: "",
      organizerMobile: "",
      organizerEmail: "",
      campName: "",
      campAddress: "",
      state: "",
      district: "",
      bloodBank: "",
      campDate: "",
      startTime: "",
      endTime: "",
    })
    setTimeout(() => setFormSubmitted(false), 2000)
  }

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-800">Host a Camp</CardTitle>
              <CardDescription className="text-gray-600">Organize a new blood donation camp</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organization-type" className="text-gray-700">Organization Type *</Label>
                <Select
                  value={form.organizationType}
                  onValueChange={val => setForm({ ...form, organizationType: val })}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization-name" className="text-gray-700">Organization Name *</Label>
                <Input
                  id="organization-name"
                  placeholder="Enter organization name"
                  value={form.organizationName}
                  maxLength={100}
                  onChange={e => setForm({ ...form, organizationName: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organizer-name" className="text-gray-700">Organizer Name *</Label>
                <Input
                  id="organizer-name"
                  placeholder="Enter organizer name"
                  value={form.organizerName}
                  maxLength={100}
                  onChange={e => setForm({ ...form, organizerName: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organizer-mobile" className="text-gray-700">Organizer Mobile No *</Label>
                <Input
                  id="organizer-mobile"
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={form.organizerMobile}
                  onChange={e => setForm({ ...form, organizerMobile: e.target.value.replace(/\D/g, "") })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organizer-email" className="text-gray-700">Organizer Email Id *</Label>
                <Input
                  id="organizer-email"
                  type="email"
                  placeholder="Enter email"
                  value={form.organizerEmail}
                  onChange={e => setForm({ ...form, organizerEmail: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="camp-name" className="text-gray-700">Camp Name *</Label>
                <Input
                  id="camp-name"
                  placeholder="Enter camp name"
                  value={form.campName}
                  onChange={e => setForm({ ...form, campName: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="camp-address" className="text-gray-700">Camp Address *</Label>
                <Textarea
                  id="camp-address"
                  placeholder="Enter camp address"
                  value={form.campAddress}
                  onChange={e => setForm({ ...form, campAddress: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state" className="text-gray-700">State *</Label>
                <Select
                  value={form.state}
                  onValueChange={val => setForm({ ...form, state: val, district: "" })}
                  disabled={loadingStates || !!errorStates}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
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
                  value={form.district}
                  onValueChange={val => setForm({ ...form, district: val })}
                  disabled={!districts.length || loadingDistricts || !!errorDistricts}
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500">
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
                <Label htmlFor="blood-bank" className="text-gray-700">Blood Bank *</Label>
                {bloodBanks.length === 0 ? (
                  <div className="text-sm text-gray-500 p-2">No blood banks found for selected district.</div>
                ) : (
                  <Select
                    value={form.bloodBank}
                    onValueChange={val => setForm({ ...form, bloodBank: val })}
                    disabled={loadingBloodBanks || !!errorBloodBanks}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500">
                      <SelectValue placeholder="Select blood bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodBanks.map((bank: any) => (
                        <SelectItem key={bank.value} value={bank.value}>{bank.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="camp-date" className="text-gray-700">Camp Propose Date *</Label>
                <Input
                  id="camp-date"
                  type="date"
                  min={getToday()}
                  value={form.campDate}
                  onChange={e => setForm({ ...form, campDate: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-time" className="text-gray-700">Start Time (24HH:MM) *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time" className="text-gray-700">End Time (24HH:MM) *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Calendar className="mr-2 h-4 w-4" />
              Host Camp
            </Button>
            {formSubmitted && (
              <div className="text-green-600 text-center font-semibold mt-2">Camp Hosted Successfully</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
