<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Drug;
use Illuminate\Support\Facades\Auth;

class DrugLikeController extends Controller
{
    /**
     * Handle liking or disliking a drug.
     */
    public function toggleLike(Request $request)
    {
        $request->validate([
            'drug_id' => 'required|exists:drugs,id',
            'like' => 'required|boolean',
        ]);

        $user = Auth::user();
        $drugId = $request->drug_id;
        $likeValue = $request->like;

        
        $existingLike = Like::where('drug_id', $drugId)->where('user_id', $user->id)->first();

        if ($existingLike) {
          
            if ($existingLike->like == $likeValue) {
                return response()->json(['message' => 'Action already taken.'], 400);
            }

            
            $existingLike->update(['like' => $likeValue]);
            return response()->json(['message' => 'Like/Dislike updated.']);
        } else {
           
            Like::create([
                'drug_id' => $drugId,
                'user_id' => $user->id,
                'like' => $likeValue,
            ]);
            return response()->json(['message' => 'Like/Dislike added.']);
        }
    }
}
