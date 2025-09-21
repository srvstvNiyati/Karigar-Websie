
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OtpVerificationFormProps {
  phoneNumber: string;
  onSuccess: () => void;
  onChangeNumber: () => void;
}

export function OtpVerificationForm({ phoneNumber, onSuccess, onChangeNumber }: OtpVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
        toast({ title: "Invalid OTP", description: "Please enter a 6-digit OTP.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Assuming OTP is always correct for this demo
    toast({ title: "Success!", description: "Your phone number has been verified." });
    onSuccess();
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsResending(false);
    toast({ title: "OTP Resent", description: "A new OTP has been sent to your number." });
  }

  return (
    <Card className="w-full">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Phone Verification</CardTitle>
            <CardDescription>
                Enter the 6-digit OTP sent to <span className="font-semibold text-foreground">{phoneNumber}</span>.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-center">
                 <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    className="text-2xl tracking-[1.5rem] text-center w-full max-w-xs"
                />
            </div>

            <div className="text-center text-sm">
                Didn't receive the code?{' '}
                <Button variant="link" onClick={handleResendOtp} disabled={isResending} className="p-0 h-auto">
                    {isResending ? 'Resending...' : 'Resend OTP'}
                </Button>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button onClick={handleVerify} disabled={isLoading || otp.length !== 6} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
            </Button>
            <Button variant="outline" onClick={onChangeNumber} className="w-full">
                Change Number
            </Button>
      </CardFooter>
    </Card>
  );
}
