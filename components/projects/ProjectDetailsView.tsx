"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectDetails {
  id: number;
  name: string;
  description: string | null;
  team_id: number;
  created_by: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "archived";
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectDetailsViewProps {
  projectId: number;
  currentUserId: number;
  userRole: "ba" | "client";
}

export function ProjectDetailsView({
  projectId,
  currentUserId,
  userRole,
}: ProjectDetailsViewProps) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.statusText}`);
        }

        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/projects/${projectId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve project");
      }

      const updated = await response.json();
      setProject(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve project");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please provide a rejection reason:");
    if (!reason) return;

    try {
      setRejecting(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/projects/${projectId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejection_reason: reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject project");
      }

      const updated = await response.json();
      setProject(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject project");
    } finally {
      setRejecting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return <div className="text-center text-muted-foreground">Project not found</div>;
  }

  const isCreator = project.created_by === currentUserId;
  const isPending = project.status === "pending";
  const canApproveReject = userRole === "ba" && isPending;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
      </Card>

      {/* Rejection Reason Alert */}
      {project.status === "rejected" && project.rejection_reason && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Rejection Reason:</strong> {project.rejection_reason}
          </AlertDescription>
        </Alert>
      )}

      {/* Project Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team ID</p>
              <p className="text-base">{project.team_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-base">User #{project.created_by}</p>
              {isCreator && <Badge className="mt-1">You</Badge>}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-base">{new Date(project.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">{new Date(project.updated_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Approval Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <ProjectStatusBadge status={project.status} className="mt-1" />
            </div>
            {project.approved_by && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                  <p className="text-base">User #{project.approved_by}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved At</p>
                  <p className="text-base">
                    {new Date(project.approved_at!).toLocaleString()}
                  </p>
                </div>
              </>
            )}
            {isPending && (
              <div className="pt-2 text-sm text-muted-foreground">
                Awaiting Business Analyst approval
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {canApproveReject && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={approving || rejecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {approving ? "Approving..." : "Approve Project"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejecting || approving}
              variant="destructive"
            >
              {rejecting ? "Rejecting..." : "Reject Project"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button variant="outline" onClick={() => router.push(`/teams/${project.team_id}`)}>
          View Team
        </Button>
      </div>
    </div>
  );
}