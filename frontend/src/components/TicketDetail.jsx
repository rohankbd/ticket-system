import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTicket, updateTicket, deleteTicket } from "../services/api";
import TicketForm from "./TicketForm";
import { useAuth } from "../context/AuthContext";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: ticket, isLoading } = useQuery(["ticket", id], () =>
    getTicket(id)
  );

  const updateMutation = useMutation(
    (updatedData) => updateTicket(id, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ticket", id]);
        setShowEditForm(false);
      },
    }
  );

  const deleteMutation = useMutation(deleteTicket, {
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleDelete = () => {
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ticket Details</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            {(user.is_staff || ticket.user === user.id) && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ticket.title}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ticket.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ticket.priority}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(ticket.created_at).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(ticket.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {showEditForm && (
        <TicketForm
          initialData={ticket}
          onSubmit={(data) => updateMutation.mutate(data)}
          onClose={() => setShowEditForm(false)}
          isSubmitting={updateMutation.isLoading}
        />
      )}
    </div>
  );
};

export default TicketDetail;
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { getTicket, updateTicket, deleteTicket } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import TicketForm from './TicketForm';

// const TicketDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { canEdit, isAdmin } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const queryClient = useQueryClient();

//   const { data: ticket, isLoading } = useQuery(['ticket', id], () => getTicket(id));

//   const updateMutation = useMutation(
//     (data) => updateTicket(id, data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['ticket', id]);
//         setIsEditing(false);
//       }
//     }
//   );

//   const deleteMutation = useMutation(
//     () => deleteTicket(id),
//     {
//       onSuccess: () => navigate('/dashboard')
//     }
//   );

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-64">Loading...</div>;
//   }

//   const canModifyTicket = canEdit(ticket.user);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {isEditing ? (
//         <TicketForm
//           initialData={ticket}
//           onSubmit={updateMutation.mutate}
//           onClose={() => setIsEditing(false)}
//           isSubmitting={updateMutation.isLoading}
//           isAdmin={isAdmin()}
//         />
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//           <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">
//               Ticket Details
//             </h3>
//             {canModifyTicket && (
//               <div className="space-x-4">
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (window.confirm('Are you sure you want to delete this ticket?')) {
//                       deleteMutation.mutate();
//                     }
//                   }}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="border-t border-gray-200">
//             <dl>
//               <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500">Title</dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   {ticket.title}
//                 </dd>
//               </div>
//               <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500">Status</dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                     ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 
//                       ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
//                       'bg-gray-100 text-gray-800'}`}>
//                     {ticket.status}
//                   </span>
//                 </dd>
//               </div>
//               <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500">Priority</dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   {ticket.priority}
//                 </dd>
//               </div>
//               <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500">Description</dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   {ticket.description}
//                 </dd>
//               </div>
//               {isAdmin() && (
//                 <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                   <dt className="text-sm font-medium text-gray-500">Created By</dt>
//                   <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                     {ticket.user_email}
//                   </dd>
//                 </div>
//               )}
//             </dl>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketDetail;