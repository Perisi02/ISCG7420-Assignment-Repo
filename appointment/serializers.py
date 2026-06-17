from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Doctor, AppointmentSlot, Appointment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff", "is_active"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("This email is already registered.")

        return data

    def create(self, validated_data):
        validated_data.pop("password2")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        Token.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"]
        )

        if user is None:
            raise serializers.ValidationError("Invalid username or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")

        token, created = Token.objects.get_or_create(user=user)

        return {
            "token": token.key,
            "user": user
        }


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["id", "name", "specialty", "phone", "email", "bio", "is_active"]


class AppointmentSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    doctor_specialty = serializers.CharField(source="doctor.specialty", read_only=True)
    is_booked = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentSlot
        fields = [
            "id",
            "doctor",
            "doctor_name",
            "doctor_specialty",
            "date",
            "start_time",
            "end_time",
            "is_available",
            "is_booked",
        ]

    def get_is_booked(self, obj):
        return hasattr(obj, "appointment")

    def validate(self, data):
        start_time = data.get("start_time", getattr(self.instance, "start_time", None))
        end_time = data.get("end_time", getattr(self.instance, "end_time", None))

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError("End time must be after start time.")

        return data


class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source="patient.username", read_only=True)
    doctor_name = serializers.CharField(source="slot.doctor.name", read_only=True)
    doctor_specialty = serializers.CharField(source="slot.doctor.specialty", read_only=True)
    slot_date = serializers.DateField(source="slot.date", read_only=True)
    slot_start_time = serializers.TimeField(source="slot.start_time", read_only=True)
    slot_end_time = serializers.TimeField(source="slot.end_time", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_username",
            "slot",
            "doctor_name",
            "doctor_specialty",
            "slot_date",
            "slot_start_time",
            "slot_end_time",
            "reason",
            "status",
            "booked_at",
        ]
        read_only_fields = ["patient", "status", "booked_at"]

    def validate_slot(self, slot):
        if not slot.is_available or hasattr(slot, "appointment"):
            raise serializers.ValidationError("This appointment slot is already booked.")

        return slot

    def create(self, validated_data):
        request = self.context["request"]
        slot = validated_data["slot"]

        appointment = Appointment.objects.create(
            patient=request.user,
            slot=slot,
            reason=validated_data.get("reason", "")
        )

        slot.is_available = False
        slot.save()

        return appointment


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["reason"]


class AdminAppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source="patient.username", read_only=True)
    doctor_name = serializers.CharField(source="slot.doctor.name", read_only=True)
    slot_date = serializers.DateField(source="slot.date", read_only=True)
    slot_start_time = serializers.TimeField(source="slot.start_time", read_only=True)
    slot_end_time = serializers.TimeField(source="slot.end_time", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_username",
            "slot",
            "doctor_name",
            "slot_date",
            "slot_start_time",
            "slot_end_time",
            "reason",
            "status",
            "booked_at",
        ]


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active", "date_joined"]
