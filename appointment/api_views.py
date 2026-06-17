from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Doctor, AppointmentSlot, Appointment
from .permissions import IsOwnerOrStaff, IsStaffUser
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    DoctorSerializer,
    AppointmentSlotSerializer,
    AppointmentSerializer,
    AppointmentUpdateSerializer,
    AdminAppointmentSerializer,
    PatientSerializer,
)

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token = serializer.validated_data["token"]

            return Response({
                "token": token,
                "user": UserSerializer(user).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class DoctorListAPIView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Doctor.objects.filter(is_active=True).order_by("name")

class SlotListAPIView(generics.ListAPIView):
    serializer_class = AppointmentSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return AppointmentSlot.objects.filter(
            is_available=True,
            doctor__is_active=True,
            appointment__isnull=True
        ).order_by("date", "start_time")

class AppointmentCreateAPIView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

class MyAppointmentsAPIView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(
            patient=self.request.user
        ).order_by("slot__date", "slot__start_time")

class AppointmentDetailAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Appointment.objects.all()

        return Appointment.objects.filter(patient=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return AppointmentUpdateSerializer

        return AppointmentSerializer

class AppointmentCancelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            if request.user.is_staff:
                appointment = Appointment.objects.get(pk=pk)
            else:
                appointment = Appointment.objects.get(pk=pk, patient=request.user)
        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        appointment.status = "Cancelled"
        appointment.save()

        appointment.slot.is_available = True
        appointment.slot.save()

        return Response({
            "message": "Appointment cancelled successfully.",
            "appointment": AppointmentSerializer(appointment).data
        })

class AdminDashboardAPIView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response({
            "doctor_count": Doctor.objects.count(),
            "active_doctor_count": Doctor.objects.filter(is_active=True).count(),
            "slot_count": AppointmentSlot.objects.count(),
            "available_slot_count": AppointmentSlot.objects.filter(is_available=True).count(),
            "appointment_count": Appointment.objects.count(),
            "booked_appointment_count": Appointment.objects.filter(status="Booked").count(),
            "cancelled_appointment_count": Appointment.objects.filter(status="Cancelled").count(),
            "patient_count": User.objects.filter(is_staff=False).count(),
            "active_patient_count": User.objects.filter(is_staff=False, is_active=True).count(),
        })

class AdminDoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by("name")
    serializer_class = DoctorSerializer
    permission_classes = [IsStaffUser]

class AdminSlotViewSet(viewsets.ModelViewSet):
    queryset = AppointmentSlot.objects.all().order_by("date", "start_time")
    serializer_class = AppointmentSlotSerializer
    permission_classes = [IsStaffUser]

class AdminAppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by("slot__date", "slot__start_time")
    serializer_class = AdminAppointmentSerializer
    permission_classes = [IsStaffUser]

    def perform_update(self, serializer):
        appointment = serializer.save()

        if appointment.status == "Cancelled":
            appointment.slot.is_available = True
            appointment.slot.save()
        elif appointment.status == "Booked":
            appointment.slot.is_available = False
            appointment.slot.save()

class AdminPatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsStaffUser]
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return User.objects.filter(is_staff=False).order_by("username")