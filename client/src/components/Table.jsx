/* eslint-disable react/prop-types */
import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

import useAuth from "../hook/useAuth.jsx";

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Input, Spinner } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const getColumn = ({ onEdit, onDelete }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "inTeam",
    header: () => <div>In Team</div>,
    cell: ({ row }) => <div style={{ width: "20px" }}>{row.getValue("inTeam") ? "Yes" : "No"}</div>,
  },
  {
    id: "createdAt",
    header: () => <div className="text-right">Created at</div>,
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const formattedDate = formatDistanceToNow(createdAt, { addSuffix: true });
      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-4">
          <UpdateUser userId={user.id} handleSaveChanges={onEdit} />
        </div>
      );
    },
  },
];

export function UpdateUser({ userId, handleSaveChanges }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setdataLoading] = React.useState(false);
  const { token } = useAuth();

  const fetchUserData = async () => {
    try {
      setdataLoading(true);
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      const userData = await response.json();
      setName(userData.name);
      setEmail(userData.email);
      setdataLoading(false);
    } catch (error) {
      setdataLoading(false);
      toast.error("Error fetching user data");
    }
  };

  return (
    <Sheet>
      <SheetTrigger onClick={fetchUserData} asChild>
        <Button variant="outline">edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>Make changes to this user. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            {dataLoading ? (
              <Skeleton className="h-10 w-[250px]" />
            ) : (
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            {dataLoading ? (
              <Skeleton className="h-10 w-[250px]" />
            ) : (
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="blue" onClick={() => handleSaveChanges(name, email, userId, setLoading)} disabled={loading || dataLoading}>
              {loading ? <Spinner /> : "Save changes"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const DataTableDemo = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteAllButton, setShowDeleteAllButton] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 7, // Set the default page size to 6
  });
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/user/all", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setData(data);
      setLoading(false);
      // Process the fetched data here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  React.useEffect(() => {
    setShowDeleteAllButton(Object.keys(rowSelection).length > 0);
  }, [rowSelection]);

  const handleSaveChanges = React.useCallback(
    async (name, email, userId, setLoading) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        fetchData();
        toast.success("User updated successfully");
      } catch (error) {
        toast.error("Error updating user: " + (error.message || "An error occurred"));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  const columns = React.useMemo(() => getColumn({ onEdit: handleSaveChanges }), [handleSaveChanges]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel({ pageSize: 6 }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination, // Update the pagination state
    onRowSelectionChange: (selectedRowIds) => {
      setRowSelection(selectedRowIds);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleDeleteAll = async () => {
    const selectedIds = Object.keys(rowSelection).map((id) => data[id].id);

    if (selectedIds.length === 0) {
      return;
    }

    try {
      setLoading(true);

      // Promise to delete users
      const promise = new Promise((resolve, reject) => {
        fetch("http://localhost:5000/user", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ ids: selectedIds }),
        })
          .then((response) => {
            if (!response.ok) {
              response.json().then((data) => {
                reject(data.error);
              });
            }
            return response.json();
          })
          .then((data) => {
            // Additional processing after deletion
            resolve(data.msg); // Resolve with server response message
          })
          .catch(() => {
            // console.log(error);
            // reject(error);
          });
      });

      // Display toast messages based on promise state
      toast.promise(promise, {
        loading: "Deleting the Selected Users...",
        success: (message) => {
          fetchData(); // Refresh data after successful deletion
          setRowSelection({}); // Clear row selection
          setShowDeleteAllButton(false); // Hide delete button
          return <b>{message}</b>; // Use server response message as success toast
        },
        error: (error) => {
          const errorMessage = error || "Error deleting users.";
          return <b>{errorMessage}</b>;
        },
      });
    } catch (error) {
      console.error("Error deleting users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={table.getColumn("email")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            {showDeleteAllButton && (
              <AlertDialog>
                <AlertDialogTrigger>Delete All</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {Object.keys(rowSelection).length} user and there teams from the
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setRowSelection({})}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteAll()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo;
