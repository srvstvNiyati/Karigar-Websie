

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { indianLanguages } from "@/lib/languages";
import locationData from "@/lib/locations.json";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";


const phoneRegex = new RegExp(
  /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
);

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
  state: z.string().min(1, "Please select a state."),
  district: z.string().min(1, "Please select a district."),
  city: z.string().min(1, "Please select a city."),
});

export type FormValues = z.infer<typeof formSchema>;

interface SignupFormProps {
  onSuccess: (data: FormValues) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      language: "en",
      state: "",
      district: "",
      city: "",
    }
  });

  const { watch, setValue } = form;
  const selectedState = watch("state");
  const selectedDistrict = watch("district");

  const districts = locationData.states.find(s => s.name === selectedState)?.districts || [];
  const cities = districts.find(d => d.name === selectedDistrict)?.cities || [];

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSuccess(values);
  }

  return (
    <Card className="w-full">
         <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Your Account</CardTitle>
            <CardDescription>Fill in your details to get started with कारीगर.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                         <div className="flex items-center">
                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 h-10">+91</span>
                            <Input placeholder="Enter your phone number" {...field} className="rounded-l-none" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Language</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value
                                    ? indianLanguages.find(
                                        (language) => language.code === field.value
                                    )?.name
                                    : "Select language"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Command>
                                <CommandInput placeholder="Search language..." />
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-y-auto">
                                {indianLanguages.map((language) => (
                                    <CommandItem
                                    value={language.name}
                                    key={language.code}
                                    onSelect={() => {
                                        form.setValue("language", language.code)
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        language.code === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                    />
                                    {language.name}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>State</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? locationData.states.find(s => s.name === field.value)?.name : "Select state"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search state..." />
                                    <CommandEmpty>No state found.</CommandEmpty>
                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                    {locationData.states.map((state) => (
                                        <CommandItem
                                        value={state.name}
                                        key={state.name}
                                        onSelect={() => {
                                            setValue("state", state.name);
                                            setValue("district", "");
                                            setValue("city", "");
                                        }}
                                        >
                                        <Check className={cn("mr-2 h-4 w-4", state.name === field.value ? "opacity-100" : "opacity-0")} />
                                        {state.name}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>District</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!selectedState}
                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? districts.find(d => d.name === field.value)?.name : "Select district"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search district..." />
                                    <CommandEmpty>No district found.</CommandEmpty>
                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                    {districts.map((district) => (
                                        <CommandItem
                                            value={district.name}
                                            key={district.name}
                                            onSelect={() => {
                                                setValue("district", district.name);
                                                setValue("city", "");
                                            }}
                                        >
                                        <Check className={cn("mr-2 h-4 w-4", district.name === field.value ? "opacity-100" : "opacity-0")} />
                                        {district.name}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>City</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!selectedDistrict}
                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                    >
                                    {field.value || "Select city"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search city..." />
                                    <CommandEmpty>No city found.</CommandEmpty>
                                    <CommandGroup className="max-h-60 overflow-y-auto">
                                    {cities.map((city) => (
                                        <CommandItem
                                            value={city}
                                            key={city}
                                            onSelect={() => {
                                                setValue("city", city);
                                            }}
                                        >
                                        <Check className={cn("mr-2 h-4 w-4", city === field.value ? "opacity-100" : "opacity-0")} />
                                        {city}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
            </Form>
        </CardContent>
        <CardFooter>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
            </Button>
      </CardFooter>
    </Card>
  );
}

    

