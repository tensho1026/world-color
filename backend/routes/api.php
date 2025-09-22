<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Log;
use App\Models\Mood;
use App\Models\Vote;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


Log::info('api.php is loaded!');

Route::get('/ping', function () {
    return 'pong';
});

// ユーザー登録
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:5',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $user,
    ]);
});

// ログイン
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $user,
    ]);
});


Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/logout',function(Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

Route::get('get-moods',function(){
    $moods = Mood::all();
    return response()->json($moods);
});

Route::middleware('auth:sanctum')->post('/vote',function(Request $request) {
    $request->validate([
        'mood_id' => 'required|exists:moods,id',
    ]);

    $vote = Vote::updateOrCreate(
        [ 'user_id' => $request->user()->id ],
        [ 'mood_id' => $request->mood_id ]
    );

    return response()->json($vote);
});

Route::get('get-world-color', function () {
    $recentVotes = Vote::where('updated_at', '>=', Carbon::now()->subHours())->get();

    if ($recentVotes->isEmpty()) {
        return response()->json([
            'colorsDescription' => [],
            'world_color' => '#FFFFFF',
        ]);
    }

    // 集計: mood_id ごとの投票数
    $voteCounts = Vote::select('mood_id', DB::raw('count(*) as value'))
        ->where('updated_at', '>=', Carbon::now()->subHours())
        ->groupBy('mood_id')
        ->pluck('value', 'mood_id');

    $moods = Mood::whereIn('id', $voteCounts->keys())->get();

    // グラフ用: { id, name, color_code, value }
    $colorsDescription = $moods->map(function ($mood) use ($voteCounts) {
        return [
            'id' => $mood->id,
            'name' => $mood->name,
            'color_code' => $mood->color_code,
            'value' => (int) ($voteCounts[$mood->id] ?? 0),
        ];
    })->values();

    // ワールドカラー算出
    $colors = $moods->map(function ($mood) {
        $hex = ltrim($mood->color_code, '#');
        return [
            'r' => hexdec(substr($hex, 0, 2)),
            'g' => hexdec(substr($hex, 2, 2)),
            'b' => hexdec(substr($hex, 4, 2)),
        ];
    });

    $avg = [
        'r' => intval($colors->avg('r')),
        'g' => intval($colors->avg('g')),
        'b' => intval($colors->avg('b')),
    ];

    $worldColor = sprintf('#%02x%02x%02x', $avg['r'], $avg['g'], $avg['b']);

    return response()->json([
        'colorsDescription' => $colorsDescription,
        'world_color' => $worldColor,
    ]);
});