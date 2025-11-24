<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFetchFieldsToJobSearchesTable extends Migration
{
    public function up()
    {
        Schema::table('job_search', function (Blueprint $table) {
            $table->string('external_id')->nullable()->index();
            $table->text('apply_link')->nullable();
            $table->timestamp('posted_at')->nullable()->index();
            $table->string('fingerprint')->nullable()->index();
            $table->json('raw')->nullable();
        });
    }

    public function down()
    {
        Schema::table('job_search', function (Blueprint $table) {
            $table->dropColumn(['external_id','apply_link','posted_at','fingerprint','raw']);
        });
    }
}
