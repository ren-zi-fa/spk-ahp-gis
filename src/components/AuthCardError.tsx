"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AuthErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <CardTitle className="text-center">
          Oops! Something went wrong!
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-center text-muted-foreground">
          Terjadi kesalahan saat login. Silakan coba lagi.
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="link" className="w-full text-sm text-center">
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
