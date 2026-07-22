from rest_framework import viewsets, permissions
from .models import Ticket
from .serializers import TicketSerializer


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_users_list(request):
    search = request.GET.get('search', '')
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT TOP 20 UserID, UserName, UserFamily 
               FROM sec_users 
               WHERE IsActive = 1 
               AND (UserName LIKE %s OR UserFamily LIKE %s)
               ORDER BY UserName""",
            [f'%{search}%', f'%{search}%']
        )
        rows = cursor.fetchall()
    users = [{'id': r[0], 'username': r[1], 'family': r[2]} for r in rows]
    return Response(users)