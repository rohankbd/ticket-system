import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { getTickets, createTicket } from "../services/api";
import TicketForm from "./TicketForm";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const queryClient = useQueryClient();
  const { data: tickets, isLoading } = useQuery(["tickets", filters], () =>
    getTickets(filters, user.user_id)
  );

  const createMutation = useMutation(createTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("tickets");
      setShowForm(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Ticket
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tickets?.results.length > 0 ? (
            tickets.results.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {ticket.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {ticket.description.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      ticket.status === "open"
                        ? "bg-green-100 text-green-800"
                        : ticket.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                        >
                          {ticket.status}
                        </span>
                        <span className="mt-1 text-sm text-gray-500">
                          Priority: {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-center py-4">No tickets created</li>
          )}
        </ul>
      </div>

      {showForm && (
        <TicketForm
          onSubmit={(data) => createMutation.mutate(data)}
          onClose={() => setShowForm(false)}
          isSubmitting={createMutation.isLoading}
        />
      )}
    </div>
  );
};

export default Dashboard;
