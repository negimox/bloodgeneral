"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useAllStates } from "@/hooks/useAllStates"
import { useDistricts } from "@/hooks/useDistricts"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Droplets, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// TODO: Replace with real API response types
type BloodStock = {
  bloodType: string
  units: number
  expiryDate: string
  status: "critical" | "low" | "adequate" | "good"
  lastUpdated: string
}


export function BloodStock({ selectedType }: { selectedType?: "donor" | "patient" }) {
  const { data: states, loading: loadingStates, error: errorStates } = useAllStates();
  // Form schema
  const formSchema = z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    bloodGroup: z.string().default("all"),
    bloodComponent: z.string().min(1, "Blood component is required"),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Get default values from localStorage depending on selectedType
  let localDefaults = {
    state: "",
    district: "",
    bloodGroup: "all",
    bloodComponent: "11",
  };
  if (typeof window !== "undefined") {
    if (selectedType === "donor") {
      const donorRaw = localStorage.getItem("donor_information");
      if (donorRaw) {
        try {
          const donor = JSON.parse(donorRaw);
          localDefaults = {
            state: donor.state || "",
            district: donor.district || "",
            bloodGroup: donor.bloodGroup || "all",
            bloodComponent: "11", // Always Whole Blood for donor
          };
        } catch {}
      }
    } else {
      const stored = localStorage.getItem("thalassemia_patients");
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr) && arr.length > 0) {
            const patient = arr[0];
            localDefaults = {
              state: patient.state || "",
              district: patient.district || "",
              bloodGroup: patient.bloodGroup || "all",
              bloodComponent: patient.bloodComponent || "11",
            };
          }
        } catch {}
      }
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: localDefaults,
  });

  const [bloodStock, setBloodStock] = useState<any[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  // Districts depend on selected state
  const selectedState = form.watch("state");
  const { data: districts, loading: loadingDistricts, error: errorDistricts } = useDistricts(Number(selectedState) || 0);

  // ...existing code...

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "adequate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "low":
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      case "adequate":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const totalUnits = bloodStock.reduce((sum, stock) => sum + stock.units, 0);
  const criticalTypes = bloodStock.filter((stock) => stock.status === "critical").length;
  const lowTypes = bloodStock.filter((stock) => stock.status === "low").length;

  if (loadingStates) return <Skeleton className="h-32 w-full" />;
  if (errorStates) return (
    <Alert variant="destructive">
      <AlertTitle>Error loading states</AlertTitle>
      <AlertDescription>{errorStates}</AlertDescription>
    </Alert>
  );

  return (
    <div className="flex gap-3 flex-col">
      <Form {...form}>
        <form
          className="grid gap-6"
          onSubmit={form.handleSubmit(async (values) => {
            setLoadingStock(true);
            setErrorStock(null);
            try {
              // Use new API function
              const data = await import("@/lib/api").then(mod => mod.fetchBloodStock(values));
              setBloodStock(data.data || []);
            } catch (err: any) {
              setErrorStock(err.message);
              setBloodStock([]);
            } finally {
              setLoadingStock(false);
            }
          })}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Array.isArray(states?.data) ? states.data :
                          Array.isArray(states?.states) ? states.states :
                          Array.isArray(states) ? states :
                          []
                        ).map((state: any) => (
                          <SelectItem key={state.stateCode} value={state.stateCode.toString()}>
                            {state.stateName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value} disabled={!districts || !Array.isArray(districts.records)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(districts?.records) && districts.records.map((district: any) => (
                          <SelectItem key={district.value} value={district.value}>{district.id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Blood Groups" />
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
                        <SelectItem value="all">All Blood Groups</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodComponent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Component</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Whole Blood" />
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full mx-auto flex justify-between items-center gap-4">
            <Button type="submit" className="mt-4 bg-red-600 hover:bg-red-700 text-white" disabled={loadingStock}>
              {loadingStock ? (<><Loader2 className="animate-spin" /><span className="animate-pulse">Searching...</span></>) : "Search Blood Stock"}
            </Button>
            
            {selectedType === "patient" && (
              <a
                href="https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/portalThalassemiaLogin.cnt?hmode=DETAILS"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-red-700 underline text-sm hover:text-red-900 mt-4"
              >
                Can't find any donor? Request Blood
              </a>
            )}
          </div>
        </form>
      </Form>
     
      <div className="w-full">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-100 to-red-300 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-800">Blood Stocks</CardTitle>
              {/* Legend for bank type backgrounds */}
              <div className="flex items-center gap-3 bg-red-100 p-2 rounded">
                <div className="flex items-center gap-1 ">
                  <span className="inline-block w-4 h-4 rounded bg-blue-200 border border-blue-200" />
                  <span className="text-xs text-gray-700">Govt Bank</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded bg-white border border-gray-200" />
                  <span className="text-xs text-gray-700">Other Bank</span>
                </div>
              </div>
            </div>
            <CardDescription className="text-gray-600">Current inventory status</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {Array.isArray(bloodStock) && bloodStock.length > 0 ? (
                <div className="">
                  <Table className="">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">S/N</TableHead>
                        <TableHead className="w-56 align-middle whitespace-nowrap p-1 text-sm">Blood Bank</TableHead>
                        <TableHead className="w-32 text-center align-middle whitespace-nowrap p-1">Status</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bloodStock.map((stock: any[], idx: number) => {
                        // Use the 'Type' column (stock[2]) to determine if it's a government bank
                        const typeValue = (stock[2] || "").toLowerCase().trim();
                        const isGovt = /^govt\.?$/i.test(stock[2]?.trim());

                        // Extract contact info from address
                        const addressStr = stock[1] || "";
                        // Regex to extract Phone, Fax, Email
                        const contactRegex = /Phone:\s*([^,]*)\s*,Fax:\s*([^,]*)\s*,\s*Email:\s*([^<]*)/i;
                        const contactMatch = addressStr.match(contactRegex);
                        let contactInfo;
                        if (contactMatch) {
                          const phone = contactMatch[1]?.trim() || "-";
                          const fax = contactMatch[2]?.trim() || "-";
                          const email = contactMatch[3]?.trim() || "-";
                          contactInfo = (
                            <div className="flex flex-col text-xs text-gray-700">
                              <span><b>Phone:</b> {phone}</span>
                              <span><b>Fax:</b> {fax}</span>
                              <span><b>Email:</b> {email}</span>
                            </div>
                          );
                        } else {
                          contactInfo = (
                            <div className="flex flex-col text-xs text-gray-700">
                              <span><b>Phone:</b> -</span>
                              <span><b>Fax:</b> -</span>
                              <span><b>Email:</b> -</span>
                            </div>
                          );
                        }
                        // Remove contact info from address
                        const addressClean = addressStr.replace(contactRegex, "").replace(/<br\s*\/?>(?!$)/gi, "<br>").replace(/\s*$/, "");

                        // Optimized status logic using <p> tag class
                        let statusHtml = stock[3] || "";
                        let statusText = "";
                        let statusClass = "";
                        // Extract class name from <p>
                        const classMatch = statusHtml.match(/<p[^>]*class=['\"]([^'\"]+)['\"]/i);
                        const statusClassName = classMatch ? classMatch[1] : "";
                        statusText = statusHtml.replace(/<[^>]+>/g, "").trim();
                        if (statusClassName === "text-success") {
                          statusClass = "text-green-600 font-bold";
                        } else if (statusClassName === "text-danger") {
                          statusClass = "text-red-600 font-bold";
                        } else {
                          statusClass = "text-gray-600";
                        }

                        return (
                          <TableRow key={stock[0]} className={isGovt ? "bg-blue-200" : "bg-white"}>
                            <TableCell className="font-semibold text-gray-900">{idx + 1}</TableCell>
                            <TableCell className="w-56 align-middle whitespace-nowrap p-1 text-sm">
                              <span className="text-gray-600 font-semibold" dangerouslySetInnerHTML={{ __html: addressClean }} />
                            </TableCell>
                            <TableCell className="w-32 text-center align-middle whitespace-nowrap p-1">
                              <span className={statusClass + ' text-sm'}>{statusText}</span>
                            </TableCell>
                            <TableCell>{contactInfo}</TableCell>
                            <TableCell>
                              <span className="font-semibold text-gray-900">{stock[2]}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-gray-900">{stock[4]}</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

            ) : (
              <div className="text-center text-gray-500">No blood stock data available. Please select all filters and search.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
