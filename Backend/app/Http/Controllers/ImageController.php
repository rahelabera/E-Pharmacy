<?php
namespace App\Http\Controllers;

use App\Customs\Services\ImageService; 
use Illuminate\Http\Request;

class ImageController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }


    public function store(Request $request)
    {
        $image = $this->imageService->storeImage($request);
        return response()->json(['message' => 'Profile picture updated successfully', 'image' => $image], 201);
    }

 
    public function show($userId)
    {
        $image = $this->imageService->getProfilePicture($userId);
        return $image ? response()->json($image, 200) : response()->json(['message' => 'No profile picture found'], 404);
    }


    public function destroy()
    {
        return $this->imageService->deleteProfilePicture()
            ? response()->json(['message' => 'Profile picture deleted successfully'], 200)
            : response()->json(['message' => 'No profile picture found'], 404);
    }
}
