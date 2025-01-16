from rest_framework import permissions


class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a ticket to view or edit it.
    Administrators can view and edit all tickets.
    """
    def has_permission(self, request, view):
        # Allow administrators to perform any action
        if request.user.is_staff:
            return True
        # Allow authenticated users to list and create tickets
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow administrators to perform any action
        if request.user.is_staff:
            return True
        # Allow owners to view and edit their own tickets
        return obj.user == request.user