from django.contrib.auth import get_user_model
from rest_framework import serializers
import re

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # CreateAPIView는 create성공시 serializers.data를 리턴함.
    # (암호화 되었지만) password를 보내주는건 곤란하므로 write_only=True로 방지.

    def create(self, validated_data):
        # view에서 serializer.save()시
        # self.create 메소드가 실행되는데 이를 오버라이드.
        # 그냥 두면 user.password = validated_data["password"] 처럼
        # password를 암호화 하지 않고 그냥 저장함.
        user = User.objects.create(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()

        # FYI: .save는 BaseSerializer로부터 상속됨.
        # FYI: .create는 ModelSerializer에서 상속됨.
        # ModelSerializer.create()는 ModelX._default_manager() 사용.

        return user

    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]  # pk 대신 id써도 됨.


class SuggestionUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField("get_avatar_url")

    def get_avatar_url(self, author):
        # Host주소를 아는 경우
        if re.match(r"^https?://", author.avatar_url):
            # same as
            # author.profile_img_url.startswith("http://") or
            # author.profile_img_url.startswith("https://")
            return author.avatar_url

        # Host주소를 모르는 경우 -> request정보가 필요
        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = User
        fields = ["username", "name", "avatar_url"]