from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .api_views import (
    RegisterAPIView,
    LoginAPIView,
    CurrentUserAPIView,
    DoctorListAPIView,
    SlotListAPIView,
    AppointmentCreateAPIView,
    MyAppointmentsAPIView,
    AppointmentDetailAPIView,
    AppointmentCancelAPIView,
    AdminDashboardAPIView,
    AdminDoctorViewSet,
    AdminSlotViewSet,
    AdminAppointmentViewSet,
    AdminPatientViewSet,
)

router = DefaultRouter()
router.register(r"admin/doctors", AdminDoctorViewSet, basename="admin-doctors")
router.register(r"admin/slots", AdminSlotViewSet, basename="admin-slots")
router.register(r"admin/appointments", AdminAppointmentViewSet, basename="admin-appointments")
router.register(r"admin/patients", AdminPatientViewSet, basename="admin-patients")

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="api-register"),
    path("auth/login/", LoginAPIView.as_view(), name="api-login"),
    path("auth/me/", CurrentUserAPIView.as_view(), name="api-current-user"),

    path("doctors/", DoctorListAPIView.as_view(), name="api-doctors"),
    path("slots/", SlotListAPIView.as_view(), name="api-slots"),

    path("appointments/", AppointmentCreateAPIView.as_view(), name="api-create-appointment"),
    path("appointments/my/", MyAppointmentsAPIView.as_view(), name="api-my-appointments"),
    path("appointments/<int:pk>/", AppointmentDetailAPIView.as_view(), name="api-appointment-detail"),
    path("appointments/<int:pk>/cancel/", AppointmentCancelAPIView.as_view(), name="api-cancel-appointment"),

    path("admin/dashboard/", AdminDashboardAPIView.as_view(), name="api-admin-dashboard"),

    path("", include(router.urls)),
]
