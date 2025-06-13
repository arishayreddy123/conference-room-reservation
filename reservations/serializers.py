from rest_framework import serializers
from .models import Reservation
from rooms.models import Room

class RoomSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name']

class ReservationSerializer(serializers.ModelSerializer):
    room = RoomSimpleSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(), write_only=True, source='room'
    )

    class Meta:
        model = Reservation
        fields = ['id', 'room', 'room_id', 'date', 'start_time', 'end_time']
