"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { Eye, FolderOpen } from "lucide-react";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  description: string | null;
  team_id: number;
  created_by: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "archived";
  created_at: string;
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    searchParams.get("status")
  );

  // Mock projects data - replace with API call
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 1,
        name: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        team_id: 101,
        created_by: 5,
        status: "active",
        created_at: "2025-01-15T10:00:00Z",
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Native iOS and Android application for customer engagement",
        team_id: 102,
        created_by: 6,
        status: "pending",
        created_at: "2025-01-10T14:30:00Z",
      },
      {
        id: 3,
        name: "API Integration",
        description: "Integrate third-party payment processing and analytics",
        team_id: 101,
        created_by: 5,
        status: "active",
        created_at: "2025-01-20T09:15:00Z",
      },
      {
        id: 4,
        name: "Database Migration",
        description: "Migrate from legacy database to modern cloud solution",
        team_id: 103,
        created_by: 7,
        status: "completed",
        created_at: "2024-12-15T11:00:00Z",
      },
      {
        id: 5,
        name: "Security Audit",
        description: "Comprehensive security assessment and penetration testing",
        team_id: 102,
        created_by: 6,
        status: "rejected",
        created_at: "2025-01-05T16:45:00Z",
      },
      {
        id: 6,
        name: "Documentation Update",
        description: "Update all technical documentation for current systems",
        team_id: 101,
        created_by: 5,
        status: "pending",
        created_at: "2025-01-22T13:20:00Z",
      },
    ];

    setProjects(mockProjects);
    setLoading(false);
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedStatus, searchTerm]);

  const statuses = [
    "pending",
    "approved",
    "rejected",
    "active",
    "completed",
    "archived",
  ];

  const statusCounts = statuses.reduce(
    (acc, status) => {
      acc[status] = projects.filter((p) => p.status === status).length;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading projects...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-14 px-6 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <FolderOpen className="w-8 h-8 text-purple-600" />
          Projects
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all projects across your organization
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus(null);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedStatus(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === null
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Projects ({projects.length})
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  selectedStatus === status
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-muted-foreground">No projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-2">
                      Team {project.team_id}
                    </p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
                <Link href={`/projects/${project.id}`}>
                  <Button
                    className="w-full flex items-center gap-2"
                    size="sm"
                    variant="default"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
