"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDetailsView } from "@/components/projects/ProjectDetailsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string, 10);
  const [userInfo, setUserInfo] = useState<{
    id: number;
    role: "ba" | "client";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }

        // You might have a /me endpoint or similar
        // For now, we'll store this in localStorage or get from auth state
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserInfo({
            id: user.id,
            role: user.role,
          });
        } else {
          throw new Error("User information not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user info");
      }
    };

    fetchUserInfo();
  }, [router]);

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userInfo) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <ProjectDetailsView
        projectId={projectId}
        currentUserId={userInfo.id}
        userRole={userInfo.role}
      />
    </div>
  );
}