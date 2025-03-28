<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'image_path'];

    // Create & Store Image
    public static function storeImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'title' => 'nullable|string|max:255',
        ]);

        $imagePath = $request->file('image')->store('images', 'public');

        return self::create([
            'title' => $request->title,
            'image_path' => $imagePath,
        ]);
    }

    // Retrieve All Images
    public static function getAllImages()
    {
        return self::all();
    }

    // Retrieve Single Image
    public static function getImageById($id)
    {
        return self::find($id);
    }

    // Update Image
    public static function updateImage(Request $request, $id)
    {
        $image = self::find($id);
        if (!$image) return null;

        $request->validate([
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'title' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            Storage::delete('public/' . $image->image_path);
            $imagePath = $request->file('image')->store('images', 'public');
            $image->image_path = $imagePath;
        }

        $image->title = $request->title ?? $image->title;
        $image->save();

        return $image;
    }

    // Delete Image
    public static function deleteImage($id)
    {
        $image = self::find($id);
        if (!$image) return false;

        Storage::delete('public/' . $image->image_path);
        return $image->delete();
    }
}

