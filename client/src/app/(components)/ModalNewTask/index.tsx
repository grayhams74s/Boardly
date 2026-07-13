import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import { formatISO } from "date-fns";
import { FilePlusCorner, Loader2 } from "lucide-react";
import React, { type FormEvent, useState } from "react";
import { toast } from "sonner";
import Modal from "../Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
};

const initialStatus = Status.ToDo;
const initialPriority = Priority.Backlog;

const ModalNewTask = ({ isOpen, onClose, projectId }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus);
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const parsedProjectId = Number(projectId);
  const parsedAuthorUserId = Number(authorUserId);
  const isDateRangeValid =
    !startDate || !dueDate || new Date(dueDate) >= new Date(startDate);
  const isFormValid =
    title.trim().length > 0 &&
    startDate.length > 0 &&
    dueDate.length > 0 &&
    Number.isInteger(parsedProjectId) &&
    Number.isInteger(parsedAuthorUserId) &&
    parsedAuthorUserId > 0 &&
    isDateRangeValid;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus(initialStatus);
    setPriority(initialPriority);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAuthorUserId("");
    setAssignedUserId("");
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isLoading) return;

    const toastId = toast.loading("Creating task", {
      description: "Please wait while your task is being created.",
    });

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        tags: tags.trim() || undefined,
        startDate: formatISO(new Date(startDate), { representation: "complete" }),
        dueDate: formatISO(new Date(dueDate), { representation: "complete" }),
        projectId: parsedProjectId,
        authorUserId: parsedAuthorUserId,
        assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
      }).unwrap();

      toast.success("Task created successfully", {
        id: toastId,
        description: "Your new task is ready.",
      });
      resetForm();
      onClose();
    } catch {
      toast.error("Failed to create task", {
        id: toastId,
        description: "Please check the details and try again.",
      });
    }
  };

  const inputStyles =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white";
  const labelStyles =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200";

  return (
    <Modal name="Create New Task" isOpen={isOpen} onClose={handleClose}>
      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className={labelStyles} htmlFor="task-title">
            Task title
          </label>
          <input
            id="task-title"
            type="text"
            className={inputStyles}
            placeholder="Enter a task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className={labelStyles} htmlFor="task-description">
            Description
          </label>
          <textarea
            id="task-description"
            className={`${inputStyles} min-h-24 resize-y`}
            placeholder="Add task details (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              className={inputStyles}
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
              disabled={isLoading}
            >
              {Object.values(Status).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyles} htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className={inputStyles}
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              disabled={isLoading}
            >
              {Object.values(Priority).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelStyles} htmlFor="task-tags">
            Tags
          </label>
          <input
            id="task-tags"
            type="text"
            className={inputStyles}
            placeholder="e.g. design, frontend (optional)"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="task-start-date">
              Start date
            </label>
            <input
              id="task-start-date"
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="task-due-date">
              Due date
            </label>
            <input
              id="task-due-date"
              type="date"
              className={inputStyles}
              min={startDate || undefined}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              disabled={isLoading}
              required
            />
            {!isDateRangeValid && (
              <p className="mt-1.5 text-xs text-red-600">
                Due date cannot be before the start date.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelStyles} htmlFor="task-author">
              Author user ID
            </label>
            <input
              id="task-author"
              type="number"
              min="1"
              step="1"
              className={inputStyles}
              placeholder="Enter author ID"
              value={authorUserId}
              onChange={(event) => setAuthorUserId(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className={labelStyles} htmlFor="task-assignee">
              Assignee user ID
            </label>
            <input
              id="task-assignee"
              type="number"
              min="1"
              step="1"
              className={inputStyles}
              placeholder="Optional"
              value={assignedUserId}
              onChange={(event) => setAssignedUserId(event.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-primary px-4 py-2.5 text-base font-medium text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <FilePlusCorner className="h-5 w-5" aria-hidden="true" />
          )}
          {isLoading ? "Creating task..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
