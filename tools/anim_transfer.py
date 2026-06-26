"""
anim_transfer.py — tempelkan animasi Mixamo (FBX) ke avatar Avaturn (GLB),
lalu export GLB siap pakai. TANPA membuka Blender (mode headless).

Pakai:
  blender --background --python tools/anim_transfer.py -- AVATAR.glb ANIM.fbx OUTPUT.glb

Contoh (Windows):
  "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" --background ^
    --python tools/anim_transfer.py -- model.glb Idle.fbx public/models/guide/character.glb

Cara kerja: avatar Avaturn & FBX Mixamo (dari mesh_for_mixamo) memakai nama tulang
yang sama (Hips, Spine, ...), jadi "action" animasi Mixamo bisa langsung dipasang ke
armature avatar. Mesh avatar tetap ter-skin ke armature-nya — kita cuma menggerakkannya.
Diuji pada Blender 5.1 (Action API bersistem "slot").
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


def main():
    avatar_path, anim_path, out_path = get_args()
    clear_scene()

    # 1) Import avatar GLB (mesh sudah ter-skin ke armature-nya)
    bpy.ops.import_scene.gltf(filepath=avatar_path)
    avatar_arm = first_armature(bpy.context.scene.objects)
    if not avatar_arm:
        raise SystemExit("Tidak menemukan armature di avatar GLB.")

    # Buang mesh nyasar tanpa vertex group (mis. Icosphere) supaya tak ikut ter-export
    for o in list(bpy.context.scene.objects):
        if o.type == "MESH" and len(o.vertex_groups) == 0:
            bpy.data.objects.remove(o, do_unlink=True)

    before = set(bpy.context.scene.objects)

    # 2) Import FBX animasi Mixamo
    bpy.ops.import_scene.fbx(filepath=anim_path)
    new_objs = set(bpy.context.scene.objects) - before
    mixamo_arm = first_armature(new_objs)
    if not mixamo_arm or not mixamo_arm.animation_data or not mixamo_arm.animation_data.action:
        raise SystemExit("Tidak menemukan animasi di FBX Mixamo.")
    action = mixamo_arm.animation_data.action

    # 3) Pasang action ke armature avatar (nama tulang sama, langsung nyambung)
    if not avatar_arm.animation_data:
        avatar_arm.animation_data_create()
    avatar_arm.animation_data.action = action
    # Blender 4.4+/5.x: action memakai "slot" — bind slot pertama agar animasi aktif
    slots = getattr(action, "slots", None)
    if slots and len(slots):
        try:
            avatar_arm.animation_data.action_slot = slots[0]
        except Exception:
            pass

    # 4) Hapus objek Mixamo generik (armature + mesh-nya), sisakan avatar
    for o in list(new_objs):
        bpy.data.objects.remove(o, do_unlink=True)

    # 5) Export GLB dengan animasi
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        export_animations=True,
    )
    print(f"OK -> {out_path}")


if __name__ == "__main__":
    main()
