from django.urls import path
from .views import register_patient, register_doctor, login

urlpatterns = [
    path('register/patient/', register_patient),
    path('register/doctor/', register_doctor),
    path("login/", login),
]
