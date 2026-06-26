"""
anim_transfer.py — tempelkan animasi Mixamo (FBX) ke avatar Avaturn (GLB),
lalu export GLB siap pakai. TANPA membuka Blender (mode headless).

Pakai:
  blender --background --python tools/anim_transfer.py -- AVATAR.glb ANIM.fbx OUTPUT.glb

Contoh (Windows):
  "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" --background ^
    --python tools/anim_transfer.py -- avatar.glb idle.fbx public/models/guide/character.glb

Cara kerja: avatar Avaturn & FBX generik Mixamo punya rangka (skeleton) yang sama,
jadi "action" animasi Mixamo bisa dipindah ke armature avatar. Script ini juga
membuang prefix 'mixamorig:' agar nama tulang cocok.
"""
import bpy
import sys


def get_args():
    argv = sys.argv
    if "--" not in argv:
        raise SystemExit("Argumen kurang. Lihat contoh pemakaian di atas file ini.")
    avatar, anim, out = argv[argv.index("--") + 1:]
    return avatar, anim, out


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def first_armature(objects):
    for o in objects:
        if o.type == "ARMATURE":
            return o
    return None


def strip_prefix(armature, action):
    """Buang 'mixamorig:' dari nama tulang & dari data_path action supaya cocok."""
    for bone in armature.data.bones:
        if bone.name.startswith("mixamorig:"):
            bone.name = bone.name.split(":", 1)[1]
    if action:
        for fc in action.fcurves:
            if "mixamorig:" in fc.data_path:
                fc.data_path = fc.data_path.replace("mixamorig:", "")


def main():
    avatar_path, anim_path, out_path = get_args()
    clear_scene()

    # 1) Import avatar GLB
    bpy.ops.import_scene.gltf(filepath=avatar_path)
    avatar_arm = first_armature(bpy.context.scene.objects)
    if not avatar_arm:
        raise SystemExit("Tidak menemukan armature di avatar GLB.")

    before = set(bpy.context.scene.objects)

    # 2) Import FBX animasi Mixamo
    bpy.ops.import_scene.fbx(filepath=anim_path)
    new_objs = set(bpy.context.scene.objects) - before
    mixamo_arm = first_armature(new_objs)
    if not mixamo_arm or not mixamo_arm.animation_data:
        raise SystemExit("Tidak menemukan animasi di FBX Mixamo.")

    action = mixamo_arm.animation_data.action

    # 3) Samakan nama tulang (buang prefix mixamorig:)
    strip_prefix(mixamo_arm, action)

    # 4) Pasang action ke armature avatar
    if not avatar_arm.animation_data:
        avatar_arm.animation_data_create()
    avatar_arm.animation_data.action = action

    # 5) Hapus objek Mixamo generik (sisakan avatar)
    for o in new_objs:
        bpy.data.objects.remove(o, do_unlink=True)

    # 6) Export GLB dengan animasi
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        export_animations=True,
    )
    print(f"OK -> {out_path}")


if __name__ == "__main__":
    main()
