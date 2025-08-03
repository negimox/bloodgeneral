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
import { Droplets, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
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


export function BloodStock() {
  const { data: states, loading: loadingStates, error: errorStates } = useAllStates();
  // Form schema
  const formSchema = z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    bloodGroup: z.string().default("all"),
    bloodComponent: z.string().min(1, "Blood component is required"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      district: "",
      bloodGroup: "all",
      bloodComponent: "11",
    },
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
          <Button type="submit" className="mt-4 bg-red-600 hover:bg-red-700 text-white" disabled={loadingStock}>
            {loadingStock ? "Searching..." : "Search Blood Stock"}
          </Button>
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
                        <TableHead>Address</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bloodStock.map((stock: any[], idx: number) => {
                        // Use the 'Type' column (stock[2]) to determine if it's a government bank
                        const typeValue = (stock[2] || "").toLowerCase().trim();
                        // Match 'govt.' (with dot, case-insensitive, possible whitespace)
                        const isGovt = /^govt\.?$/i.test(stock[2]?.trim());
                        
                        return (
                          <TableRow key={stock[0]} className={isGovt ? "bg-blue-200" : "bg-white"}>
                            <TableCell className="font-semibold text-gray-900">{idx + 1}</TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600 font-semibold" dangerouslySetInnerHTML={{ __html: (stock[1] || "").replace(/<br\s*\/?>(?!$)/gi, "<br>") }} />
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-gray-900">{stock[2]}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: stock[3] }} />
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
