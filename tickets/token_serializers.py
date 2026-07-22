from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db import connection


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT u.Title
                   FROM sec_users su
                   LEFT JOIN Emp_Employee e ON su.FKPersonID = e.FKPersonID
                   LEFT JOIN Emp_UnitOrganizational u ON e.FKUnitOrganizationalID = u.UnitID
                   WHERE su.UserName = %s""",
                [user.username]
            )
            row = cursor.fetchone()
        data['unit'] = row[0] if row and row[0] else ''
        data['full_name'] = f"{user.first_name} {user.last_name}".strip()
        data['username'] = user.username
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer