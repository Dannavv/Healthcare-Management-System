from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PatientRegisterSerializer, DoctorRegisterSerializer
from .db import users, patients, doctors
import bcrypt
from datetime import datetime
from .serializers import LoginSerializer
from .auth import create_jwt

@api_view(['POST'])
def register_patient(request):
    serializer = PatientRegisterSerializer(data=request.data)
    # serializer.is_valid(raise_exception=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data

    if users.find_one({"email": data["email"]}):
        return Response({"error": "Email already registered"}, status=400)

    hashed_pw = bcrypt.hashpw(
        data["password"].encode(),
        bcrypt.gensalt()
    )

    user = {
        "email": data["email"],
        "password": hashed_pw,
        "role": "patient",
        "created_at": datetime.utcnow()
    }

    user_id = users.insert_one(user).inserted_id

    patient_profile = {
        "user_id": user_id,
        "name": data["name"],
        "age": data["age"],
        "gender": data["gender"],
        "allergies": data.get("allergies", []),
        "medication": data.get("medication", []),
        "blood_group": data["blood_group"]
    }

    patients.insert_one(patient_profile)

    return Response({"message": "Patient registered successfully"})


@api_view(['POST'])
def register_doctor(request):
    serializer = DoctorRegisterSerializer(data=request.data)
    # serializer.is_valid(raise_exception=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data

    if users.find_one({"email": data["email"]}):
        return Response({"error": "Email already registered"}, status=400)

    hashed_pw = bcrypt.hashpw(
        data["password"].encode(),
        bcrypt.gensalt()
    )

    user = {
        "email": data["email"],
        "password": hashed_pw,
        "role": "doctor",
        "created_at": datetime.utcnow()
    }

    user_id = users.insert_one(user).inserted_id

    doctor_profile = {
        "user_id": user_id,
        "full_name": data["full_name"],
        "speciality": data["speciality"],
        "availability": data["availability"]
    }

    doctors.insert_one(doctor_profile)

    return Response({"message": "Doctor registered successfully"})

@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    user = users.find_one({"email": data["email"]})
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)

    if not bcrypt.checkpw(
        data["password"].encode(),
        user["password"]
    ):
        return Response({"error": "Invalid credentials"}, status=401)

    token = create_jwt({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return Response({
        "access_token": token,
        "role": user["role"]
    })