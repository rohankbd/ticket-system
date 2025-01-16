import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTickets, updateTicket, deleteTicket } from "../services/api";
import { Link } from "react-router-dom";
import TicketForm from "./TicketForm";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["tickets", filters], () =>
    getTickets(filters)
  );

  const updateMutation = useMutation(({ id, data }) => updateTicket(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("tickets");
      setSelectedTicket(null);
    },
  });

  const deleteMutation = useMutation(deleteTicket, {
    onSuccess: () => {
      queryClient.invalidateQueries("tickets");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.results.length > 0 ? (
              data?.results.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="inline-flex gap-2 justify-center">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 whitespace-nowrap text-center"
                >
                  No tickets created
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketForm
          initialData={selectedTicket}
          onSubmit={(data) =>
            updateMutation.mutate({ id: selectedTicket.id, data })
          }
          onClose={() => setSelectedTicket(null)}
          isSubmitting={updateMutation.isLoading}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { getTickets, updateTicket, deleteTicket } from '../services/api';

// const AdminDashboard = () => {
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: ''
//   });
//   const queryClient = useQueryClient();

//   const { data: ticketsData, isLoading } = useQuery(
//     ['tickets', filters],
//     () => getTickets(filters),
//     {
//       refetchInterval: 30000,
//     }
//   );

//   const updateTicketMutation = useMutation(
//     ({ id, data }) => updateTicket(id, data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('tickets');
//       },
//     }
//   );

//   const deleteTicketMutation = useMutation(
//     (id) => deleteTicket(id),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('tickets');
//       },
//     }
//   );

//   const handleStatusChange = async (ticketId, newStatus) => {
//     try {
//       await updateTicketMutation.mutateAsync({
//         id: ticketId,
//         data: { status: newStatus }
//       });
//     } catch (error) {
//       console.error('Failed to update ticket status:', error);
//     }
//   };

//   const handlePriorityChange = async (ticketId, newPriority) => {
//     try {
//       await updateTicketMutation.mutateAsync({
//         id: ticketId,
//         data: { priority: newPriority }
//       });
//     } catch (error) {
//       console.error('Failed to update ticket priority:', error);
//     }
//   };

//   const handleDeleteTicket = async (ticketId) => {
//     if (window.confirm('Are you sure you want to delete this ticket?')) {
//       try {
//         await deleteTicketMutation.mutateAsync(ticketId);
//       } catch (error) {
//         console.error('Failed to delete ticket:', error);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg font-semibold">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-lg shadow-md">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

//           {/* Filters */}
//           <div className="flex gap-4 mt-4">
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.status}
//               onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//             >
//               <option value="">All Status</option>
//               <option value="open">Open</option>
//               <option value="in_progress">In Progress</option>
//               <option value="resolved">Resolved</option>
//             </select>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.priority}
//               onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
//             >
//               <option value="">All Priority</option>
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Title</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">User</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Priority</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Created</th>
//                 <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {ticketsData?.results?.map((ticket) => (
//                 <tr key={ticket.id} className="hover:bg-gray-50">
//                   <td className="py-3 px-4 text-sm text-gray-900">{ticket.id}</td>
//                   <td className="py-3 px-4 text-sm text-gray-900">{ticket.title}</td>
//                   <td className="py-3 px-4 text-sm text-gray-900">{ticket.user}</td>
//                   <td className="py-3 px-4">
//                     <select
//                       className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={ticket.status}
//                       onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
//                     >
//                       <option value="open">Open</option>
//                       <option value="in_progress">In Progress</option>
//                       <option value="resolved">Resolved</option>
//                     </select>
//                   </td>
//                   <td className="py-3 px-4">
//                     <select
//                       className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={ticket.priority}
//                       onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-900">
//                     {new Date(ticket.created_at).toLocaleDateString()}
//                   </td>
//                   <td className="py-3 px-4">
//                     <button
//                       onClick={() => handleDeleteTicket(ticket.id)}
//                       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Empty State */}
//           {(!ticketsData?.results || ticketsData.results.length === 0) && (
//             <div className="text-center py-8">
//               <p className="text-gray-500 text-sm">No tickets found</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {ticketsData?.count > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="flex justify-between items-center">
//               <p className="text-sm text-gray-700">
//                 Showing {ticketsData.results.length} of {ticketsData.count} tickets
//               </p>
//               {/* Add pagination controls here if needed */}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
