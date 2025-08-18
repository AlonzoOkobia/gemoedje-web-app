import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";

export function RegistrationSuccess() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
          <h2 className="text-2xl font-bold">Registration Submitted</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground">
          Thank you for registering with Gemoedje.nl. Your application is now
          under review.
        </p>

        <div className="bg-muted/50 space-y-2 rounded-lg p-4">
          <div className="text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Next Steps</span>
          </div>
          <p className="text-sm">
            We will review your application and send you an email within 2-3
            business days. Once approved, you&apos;ll be able to choose your
            subscription plan and complete your profile.
          </p>
        </div>

        <div className="text-muted-foreground text-sm">
          <p>
            If you have any questions, please contact our support team at{" "}
            <a
              href="mailto:info@gemoedje.nl"
              className="text-primary hover:underline"
            >
              info@gemoedje.nl
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
