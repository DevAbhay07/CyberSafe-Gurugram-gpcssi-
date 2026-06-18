import { mockUsers } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck } from "lucide-react";

function roleBadge(role: string) {
  if (role === "Admin") return "bg-blue-900/40 text-blue-400 border-blue-800";
  if (role === "Analyst") return "bg-purple-900/40 text-purple-400 border-purple-800";
  return "bg-slate-700 text-slate-300 border-slate-600";
}

function statusBadge(status: string) {
  if (status === "Active") return "bg-green-900/40 text-green-400 border-green-800";
  return "bg-slate-700 text-slate-400 border-slate-600";
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-900/40 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-slate-200 font-semibold">User Management</h2>
            <p className="text-slate-500 text-xs">Manage system users and their access levels</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
          Read-only view — user management via admin portal
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-200 text-sm font-semibold">{mockUsers.length} System Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm" data-testid="users-table">
            <thead>
              <tr className="border-b border-slate-700">
                {["Name", "Email", "Role", "Status", "Last Login"].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors" data-testid={`user-row-${user.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-600/70 flex items-center justify-center text-white text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <span className="text-slate-200 font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${roleBadge(user.role)} border text-xs`}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusBadge(user.status)} border text-xs`}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
