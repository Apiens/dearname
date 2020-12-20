from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Post, Photo, Comment, Tag, Species


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        "photo_tag",
        "author",
        "species",
        "caption",
        "created_at",
        "like_users",
    ]
    list_display_links = ["caption"]

    def like_users(self, post):
        return post.like_user_set.all().count()

    def photo_tag(self, post):
        # print(post.photo_set.first().url)
        if post.photo_set.first():
            return mark_safe(
                f"<img src={post.photo_set.first().url.url} style='width: 100px;' />"
            )
        else:
            return "no_photo"

    def species(self, post):
        # print(post.subject_species.common_name)
        return post.subject_species.common_name


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    pass


@admin.register(Species)
class SpeciesAdmin(admin.ModelAdmin):
    list_display = [
        "index",
        "scientific_name",
        "common_name",
        "common_name_KOR",
        "like_users",
    ]
    list_display_links = ["scientific_name"]

    def scientific_name(self, species):
        return f"{species.genus} {species.specific_name}".title()

    def like_users(self, species):
        return species.like_user_set.all().count()