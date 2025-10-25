"use client";
import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Mail,
  Calendar,
  Shield,
  User,
  X,
  AlertTriangle,
  Save,
} from "lucide-react";
import { apiService } from "@/lib/apiService";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/admin/users");
      setUsers(response.data);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `${error.error}`,
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setSubmitting(true);
      await apiService.patch(`/admin/users/${editingUser._id}`, editForm);

      setUsers(
        users.map((u) =>
          u._id === editingUser._id
            ? { ...u, ...editForm, updatedAt: new Date().toISOString() }
            : u
        )
      );

      addToast({
        title: "Success",
        description: "User updated successfully",
        type: "success",
        duration: 3000,
      });

      setEditingUser(null);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `${error.error || "Failed to update user"}`,
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      setSubmitting(true);
      await apiService.delete(`/admin/users/${deletingUser._id}`);

      setUsers(users.filter((u) => u._id !== deletingUser._id));

      addToast({
        title: "Success",
        description: "User deleted successfully",
        type: "success",
        duration: 3000,
      });

      setDeletingUser(null);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `${error.error || "Failed to delete user"}`,
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader title="Loading users" />;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg sm:text-xl md:text-4xl font-bold text-primary mb-2">
            Users
          </h1>
          <p className="text-muted-foreground">Track and manage all users</p>
        </div>

        {/* Users Grid - Cards on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-card rounded-xl p-6 hover:shadow-lg transition-all border border-border group"
            >
              {/* User Avatar & Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingUser(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
                {user.updatedAt !== user.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">
                      Updated {formatDate(user.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              There are no users to display.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setEditingUser(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-background border rounded-lg shadow-2xl mx-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">Edit User</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update user information
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="rounded-md p-2 hover:bg-accent transition-colors"
                  disabled={submitting}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                    disabled={submitting}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingUser(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleUpdateUser}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setDeletingUser(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-background border rounded-lg shadow-2xl mx-4">
              {/* Warning Icon */}
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">
                  Delete User
                </h2>
                <p className="text-muted-foreground text-center mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {deletingUser.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                {/* User Info */}
                <div className="bg-accent rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                      {deletingUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{deletingUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deletingUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeletingUser(null)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleDeleteUser}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete User
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;
