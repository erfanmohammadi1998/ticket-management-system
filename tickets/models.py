from django.db import models
from django.contrib.auth.models import User


class Ticket(models.Model):

    PRIORITY_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
        ('urgent', 'فوری'),
    ]

    TYPE_CHOICES = [
        ('bug', 'ایراد'),
        ('suggestion', 'پیشنهاد'),
        ('new_feature', 'درخواست جدید'),
        ('question', 'سوال'),
    ]

    STATUS_CHOICES = [
        ('new', 'جدید'),
        ('reviewing', 'در حال بررسی'),
        ('done', 'انجام شد'),
        ('rejected', 'رد شد'),
    ]

    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    unit = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            last = Ticket.objects.order_by('-id').first()
            next_id = (last.id + 1) if last else 1
            self.ticket_number = f'TK-{next_id:04d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.ticket_number} - {self.title}'

    class Meta:
        ordering = ['-created_at']