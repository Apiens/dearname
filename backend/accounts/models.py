from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django_countries.fields import CountryField
from django.shortcuts import resolve_url


class User(AbstractUser):
    # User inherits
    # [password, last_login, is_active] from "AbstractBaseUser"
    # is_superuser, groups, user_permissions from "PermissionsMixin"
    # username, first_name, last_name, email, is_staff, is_active, date_joined from "AbstractUser"

    # new fields for detailed user info
    class GenderChoices(models.TextChoices):
        MALE = "M", "남성"
        FEMALE = "F", "여성"

    avatar = models.ImageField(
        blank=True,
        upload_to="accounts/avatar/%Y%m%d",
        help_text="jpg/png image with 48px*48px size",
    )
    bio = models.TextField(blank=True)
    gender = models.CharField(max_length=1, blank=True, choices=GenderChoices.choices)
    phone_number = models.CharField(
        max_length=13,
        validators=[RegexValidator(r"^010-?[1-9]\d{3}-?\d{4}$")],
        # ^:시작, $:끝
        # -?: '-'가 있거나 없거나
        # \d: 숫자 ([0-9]와 동일), {}:자릿수.
        blank=True,
    )
    website_url = models.URLField(blank=True)
    nationality = CountryField(blank=True)

    # news fields for social meida service
    follower_set = models.ManyToManyField("self", blank=True)
    following_set = models.ManyToManyField("self", blank=True)

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        else:
            return resolve_url("pydenticon_image", self.username)

    # TODO
    # things to consider : naming policy
    # nickname, english Name, username ...
    # def name(self):
    # first_name_last_countries = [
    #     "Korea, Republic of",
    #     "Korea (Democratic People's Republic of)",
    #     "Japan",
    #     "China",
    #     "Taiwan, Province of China",
    #     "HongKong",
    #     "Viet Nam",
    #     "Hungary",
    # ]
    # if self.nationality.name in first_name_last_countries:
    #     return f"{self.last_name} {self.first_name}"
    # else:
    #     return f"{self.first_name} {self.last_name}"