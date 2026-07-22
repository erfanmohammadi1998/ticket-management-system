from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'title', 'unit', 'type', 'priority', 'status', 'created_by', 'created_at']
    list_filter = ['status', 'priority', 'type']
    search_fields = ['ticket_number', 'title', 'unit']
    readonly_fields = ['ticket_number', 'created_at']