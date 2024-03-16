/* eslint-disable react/prop-types */
import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Box } from "@chakra-ui/react";
import useAuth from "../../hook/useAuth.jsx";
import { Text, Badge, FormControl } from "@chakra-ui/react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { z } from "zod";

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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getColumn = ({ onEdit, onDelete, setRowSelection }) => [
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
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "eventType",
    header: () => <div>Event Type</div>,
    cell: ({ row }) => <div>{row.getValue("eventType")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div>type</div>,
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "numParticipations",
    header: () => <div>Num Participations</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("numParticipations")}</div>,
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
          <AlertDialog>
            <AlertDialogTrigger className="text-red11 border-collapse bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px] h-10 px-4 py-2">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete 1 user and their teams from the servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRowSelection({})}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(user.id)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export function UpdateUser({ userId, handleSaveChanges }) {
  const [name, setName] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [type, setType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setdataLoading] = React.useState(false);
  const { token } = useAuth();

  const fetchUserData = async () => {
    try {
      setdataLoading(true);
      const response = await fetch(`http://localhost:5002/event/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      const userData = await response.json();
      setName(userData.name);
      setType(userData.type);
      setEventType(userData.eventType);
      setdataLoading(false);
    } catch (error) {
      setdataLoading(false);
      toast.error("Error fetching Event data");
    }
  };

  return (
    <Sheet>
      <SheetTrigger onClick={fetchUserData} asChild>
        <Button variant="outline">edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetDescription>Make changes to this Event. Click save when you&apos;re done.</SheetDescription>
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
              Event Type
            </Label>
            {dataLoading ? (
              <Skeleton className="h-10 w-[250px]" />
            ) : (
              <Input id="email" value={eventType} onChange={(e) => setEventType(e.target.value)} className="col-span-3" />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              type
            </Label>
            <Select onValueChange={(value) => setType(value)} value={type}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="blue" onClick={() => handleSaveChanges(name, type, eventType, userId, setLoading)} disabled={loading || dataLoading}>
              {loading ? <Spinner /> : "Save changes"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const eventSchema = z.object({
  eventName: z.string().nonempty("Event Name is required"),
  eventType: z.string().nonempty("Event Type is required"),
  eventTypeName: z.string().nonempty("Event Type Name is required"),
});

function CreateEvent() {
  const [eventName, setEventName] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [eventTypeName, setEventTypeName] = React.useState("");
  const [questions, setQuestions] = React.useState([{ question: "", answer: "" }]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const {token} = useAuth();

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...questions];
    list[index][name] = value;
    setQuestions(list);
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { question: "", answer: "" }]);
    } else {
      toast.error("You can only add up to 5 questions.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data
      eventSchema.parse({ eventName, eventType, eventTypeName });

      setLoading(true);
      // Send event data to the server
      // Example:
      const response = await fetch("http://localhost:5002/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          eventName,
          type: eventType,
          eventType: eventTypeName,
          questions: questions.map(({ question }) => question.question),
          answers: questions.map(({ question }) => question.answer),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      toast.success("Event created successfully");
    } catch (error) {
      // If validation fails, display error message
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Dialog
        onOpenChange={() => {
          setEventName("");
          setEventType("");
          setEventTypeName("");
          setActiveStep(0)
          setQuestions([{ question: "", answer: "" }]);
        }}
        aria-label="Create Event"
      >
        <DialogTrigger asChild>
          <Button variant="blue" size="sm">
            Create Event
          </Button>
        </DialogTrigger>{" "}
        <DialogContent className="max-w-[93%]">
          <Stepper size="lg" index={activeStep}>
            <Step>
              <StepIndicator>
                <StepStatus complete={<StepNumber>1</StepNumber>} active={<StepNumber>1</StepNumber>} />
              </StepIndicator>
              <StepTitle>Event Details</StepTitle>
              <StepSeparator />
            </Step>
            <Step>
              <StepIndicator>
                <StepStatus complete={<StepNumber>2</StepNumber>} active={<StepNumber>2</StepNumber>} />
              </StepIndicator>
              <StepTitle>Questions & Answers</StepTitle>
            </Step>
          </Stepper>
          {activeStep === 0 && (
            <>
              <div className="flex gap-3 mb-4 items-center">
                <Label htmlFor="eventName" className="text-right w-[150px]">
                  Event Name
                </Label>
                <FormControl id="eventName">
                  <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                </FormControl>
              </div>
              <div className="flex gap-3 mb-4 items-center">
                <Label htmlFor="eventType" className="text-right w-[150px]">
                  Event Type
                </Label>
                <FormControl id="eventType">
                  <Input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} />
                </FormControl>
              </div>
              <div className="flex gap-3 mb-4 items-center">
                <Label htmlFor="eventTypeName" className="text-right w-[150px]">
                  Event Type Name
                </Label>
                <FormControl id="eventTypeName">
                  <Select onValueChange={(value) => setEventTypeName(value)} value={eventTypeName}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <DialogFooter>
                <Button variant="blue" onClick={() => setActiveStep(1)}>
                  Next
                </Button>
              </DialogFooter>
            </>
          )}
          {activeStep === 1 && (
            <>
              {questions.map((question, index) => (
                <div key={index} className="flex gap-3 mb-4 items-center">
                  <Label htmlFor={`question-${index}`} className="text-right w-[170px]">
                    Question {index + 1}
                  </Label>
                  <FormControl id={`question-${index}`}>
                    <Input type="text" name="question" value={question.question} onChange={(e) => handleInputChange(index, e)} />
                  </FormControl>
                  <Label htmlFor={`answer-${index}`} className="text-right w-[170px]">
                    Answer {index + 1}
                  </Label>
                  <FormControl id={`answer-${index}`}>
                    <Input type="text" name="answer" value={question.answer} onChange={(e) => handleInputChange(index, e)} />
                  </FormControl>
                </div>
              ))}
              {questions.length < 5 && (
                <div className="flex justify-end">
                  <Button variant="default" onClick={handleAddQuestion}>
                    Add Question
                  </Button>
                </div>
              )}
              <DialogFooter>
                <Button variant="blue" onClick={handleSubmit}>
                  {loading ? <Spinner decorative={false} /> : "Submit"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const UserTable = () => {
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [showDeleteAllButton, setShowDeleteAllButton] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const { token } = useAuth();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5002/events/admin", {
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
  }, [token]);

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  React.useEffect(() => {
    setShowDeleteAllButton(Object.keys(rowSelection).length > 0);
  }, [rowSelection]);

  const handleSaveChanges = React.useCallback(
    async (name, type, eventType, userId, setLoading) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5002/event/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ eventName: name, type, eventType }),
        });

        if (!response.ok) {
          throw new Error("Failed to update Event");
        }
        fetchData();
        toast.success("Event updated successfully");
      } catch (error) {
        toast.error("Error updating Event: " + (error.message || "An error occurred"));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  const handleDeleteAll = React.useCallback(
    async (id) => {
      let selectedIds;
      if (!id) {
        selectedIds = Object.keys(rowSelection).map((id) => data[id].id);

        if (selectedIds.length === 0) {
          return;
        }
      } else {
        selectedIds = [id];
      }

      try {
        setLoading(true);

        // Promise to delete users
        const promise = new Promise((resolve, reject) => {
          fetch("http://localhost:5002/events", {
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
          loading: "Deleting the Selected Event...",
          success: (message) => {
            fetchData(); // Refresh data after successful deletion
            setRowSelection({}); // Clear row selection
            setShowDeleteAllButton(false); // Hide delete button
            return <b>{message}</b>; // Use server response message as success toast
          },
          error: (error) => {
            const errorMessage = error || "Error deleting Event.";
            return <b>{errorMessage}</b>;
          },
        });
      } catch (error) {
        console.error("Error deleting Event:", error);
      } finally {
        setLoading(false);
      }
    },
    [data, rowSelection, token, fetchData]
  );

  const columns = React.useMemo(
    () => getColumn({ onEdit: handleSaveChanges, onDelete: handleDeleteAll, setRowSelection: setRowSelection }),
    [handleDeleteAll, handleSaveChanges]
  );

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
    onPaginationChange: setPagination,
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

  return (
    <div className="w-full">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter ID..."
            value={table.getColumn("id")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
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
            <CreateEvent />

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

export default UserTable;
