<?php
namespace App\Customs\Services;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageService
{
   
    public function storeImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = $request->file('image')->store('profile_pictures', 'public');

        
        $existingImage = Image::where('user_id', auth()->id())->first();
        if ($existingImage) {
            Storage::delete('public/' . $existingImage->image_path);
            $existingImage->delete();
        }

        return Image::create([
            'user_id' => auth()->id(),
            'image_path' => $imagePath,
        ]);
    }

  
    public function getProfilePicture($userId)
    {
        return Image::where('user_id', $userId)->first();
    }


    public function deleteProfilePicture()
    {
        $image = Image::where('user_id', auth()->id())->first();
        if (!$image) return false;

        Storage::delete('public/' . $image->image_path);
        return $image->delete();
    }
}
