<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model 
{
 use HasFactory;
 protected $fillable = ['user_id','mood_id'];

 public function user() 
 {
   return $this->belongTo(User::class);
 }

 public function mood() 
 {
  return $this->belongTo(Mood::class);
 }
}