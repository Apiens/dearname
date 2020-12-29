from re import T
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import models
from django.db.models.fields import CharField
from django.db.utils import DatabaseError


# Post Model 요구사항
# author - FK, related_name, ondelete=cascade
# like_user_set - Many_to_Many, related_name
# caption -> 400자(200byte)
# photo -> Photo에서 FK로 지정
# video -> Video에서 FK로 지정
# comment -> Comment에서 FK로 지정


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Post(TimestampedModel):
    author = models.ForeignKey(
        get_user_model(), related_name="my_post_set", on_delete=models.CASCADE
    )
    caption = models.TextField(max_length=400)
    # TODO
    # autocomplete by frontend using gps info in pictures.
    # if no gps info is provided, set_as "unknown"
    location = models.CharField(max_length=100)
    active = models.BooleanField(default=True)  # Q: Would "hidden" be better naming?
    tag_set = models.ManyToManyField("Tag", blank=True, related_name="tag_post_set")
    like_user_set = models.ManyToManyField(
        get_user_model(), blank=True, related_name="like_post_set"
    )
    subject_species = models.ForeignKey("Species", on_delete=models.PROTECT)

    # TODO: group = models.ManyToManyField(UserGroup, blank=True)

    class Meta:
        ordering = ["-id"]


class Comment(TimestampedModel):
    author = models.ForeignKey(
        get_user_model(), related_name="my_comment_set", on_delete=models.CASCADE
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField(max_length=400)
    # TODO: comment on comment


class Tag(models.Model):
    name = CharField(max_length=50, unique=True)


class Photo(models.Model):
    url = models.ImageField(upload_to="drosera/photo/%Y/%m/%d")
    # Q: url 말고 좋은 필드명은 없을까...? admin.py에서 url.url 쓰려니 이상하네;
    attached_post = models.ForeignKey(
        Post, related_name="photo_set", blank=True, on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(
        blank=True
    )  # TODO: autocomplete from frontend. if error-> "unknown"
    uploaded_at = models.DateTimeField(auto_now=True)
    subject_species = models.ForeignKey("Species", on_delete=models.PROTECT)
    like_user_set = models.ManyToManyField(
        get_user_model(), blank=True, related_name="like_photo_set"
    )
    is_drawing = models.BooleanField(default=False)


# class Drawing(models.Model):
#     url = models.ImageField()
#     subject_species = models.ForeignKey("Species", on_delete=models.PROTECT)
#     like_user_set = models.ManyToManyField(
#         get_user_model(), blank=True, related_name="like_drawing_set"
#     )


class Species(models.Model):
    common_name = models.CharField(max_length=50, blank=True)
    common_name_KOR = models.CharField(max_length=50, blank=True)
    specific_name = models.CharField(max_length=50)
    genus = models.CharField(max_length=50)
    like_user_set = models.ManyToManyField(
        get_user_model(), blank=True, related_name="like_species_set"
    )
    index = models.CharField(max_length=20, blank=True)
    # TODO: which is better?
    # genus = models.ForeignKey("TaxoGenus", on_delete=models.PROTECT)


# class TaxoGenus(models.Model):
#     genus_name = models.CharField(max_length=50)
# family = models.ForeignKey("TaxoFamily", on_delete=models.PROTECT)


# class TaxoFamily:
#     pass


# class TaxoOrder:
#     pass


# class TaxoClass:
#     pass


# class TaxoPhylum:
#     pass


# TODO:
# class Video():
#     url = models.FileField()
# class Confirm():