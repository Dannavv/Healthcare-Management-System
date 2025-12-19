from rest_framework import serializers

class PatientRegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    age = serializers.IntegerField()
    gender = serializers.CharField()
    allergies = serializers.ListField(child=serializers.CharField(), required=False)
    medication = serializers.ListField(child=serializers.CharField(), required=False)
    blood_group = serializers.CharField()


class DoctorRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    speciality = serializers.CharField()
    availability = serializers.DictField()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
