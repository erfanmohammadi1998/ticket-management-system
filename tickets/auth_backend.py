import hashlib
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from django.db import connection


def hash_password(password):
    md5 = hashlib.md5(password.encode()).hexdigest().upper()
    return '-'.join(md5[i:i+2] for i in range(0, 32, 2))


class SecUserBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        hashed = hash_password(password)
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT su.UserID, su.UserName, su.UserFamily, su.IsActive, u.Title
                   FROM sec_users su
                   LEFT JOIN Emp_Employee e ON su.FKPersonID = e.FKPersonID
                   LEFT JOIN Emp_UnitOrganizational u ON e.FKUnitOrganizationalID = u.UnitID
                   WHERE su.UserName = %s AND su.Password = %s AND su.IsActive = 1""",
                [username, hashed]
            )
            row = cursor.fetchone()

        if not row:
            return None

        user_id, username, family, is_active, unit = row

        user, created = User.objects.get_or_create(username=username)
        user.first_name = username or ''
        user.last_name = family or ''
        user.email = str(user_id)
        user.save()

        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None