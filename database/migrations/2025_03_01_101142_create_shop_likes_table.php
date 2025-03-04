<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopLikesTable extends Migration
{
    public function up()
    {
        Schema::create('shop_likes', function (Blueprint $table) {
            $table->id();
            $table->string('shop_id');
            $table->integer('like_count')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shop_likes');
    }
}