from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_number',
            'title',
            'description',
            'unit',
            'type',
            'priority',
            'status',
            'attachment',
            'created_by',
            'created_by_name',
            'created_at',
        ]
        read_only_fields = ['ticket_number', 'created_at', 'created_by']

    def get_created_by_name(self, obj):
        user = obj.created_by
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name if full_name else user.username