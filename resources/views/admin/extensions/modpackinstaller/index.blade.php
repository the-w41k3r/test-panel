@extends('layouts.admin')
<?php 
    // Define extension information.
    $EXTENSION_ID = "modpackinstaller";
    $EXTENSION_NAME = stripslashes("Minecraft Modpack Installer");
    $EXTENSION_VERSION = "1.1.2";
    $EXTENSION_DESCRIPTION = stripslashes("Install Minecraft modpacks in one-click!");
    $EXTENSION_ICON = "/assets/extensions/modpackinstaller/icon.png";
    $EXTENSION_WEBSITE = "[website]";
    $EXTENSION_WEBICON = "[webicon]";
?>
@include('blueprint.admin.template')

@section('title')
    {{ $EXTENSION_NAME }}
@endsection

@section('content-header')
    @yield('extension.header')
@endsection

@section('content')
    @yield('extension.config')
    @yield('extension.description')<form id="config-form" action="" method="POST">
  <script>
    // Show save button upon form input changes.
    document.addEventListener("DOMContentLoaded", function () {showSaveButton()});
    function showSaveButton() {
      const __identifier___configForm = document.getElementById("config-form");
      const __identifier___saveOverlay = document.getElementById("save-overlay");

      __identifier___configForm.addEventListener("change", function () {
        __identifier___saveOverlay.style.display = "inline";
        setTimeout(() => {
          __identifier___saveOverlay.style.bottom = "10px";
        }, 100)
      });
    }
  </script>

  <!-- Save button overlay. (appears when form content is changed) -->
  <div id="save-overlay">{{ csrf_field() }}<button type="submit" name="_method" value="PATCH" style="transition: background-color .3s;" class="btn btn-primary btn-sm">Apply Changes</button></div>
  <style>#save-overlay {display: none;position: fixed;transition: bottom 1s;bottom: -200px;z-index: 500;}</style>

  <div class="row">

    <div class="col-xs-12 col-md-4 col-lg-3">
      <div class="box box-warning">
        <div class="box-header with-border">

          <h3 class="box-title">
            CurseForge
          </h3>

        </div>
        <div class="box-body">

            <!-- input title -->
            <div class="col-xs-12">
              <label class="control-label text-truncate">
                CurseForge API Key
              </label>

              <input 
                type="text"
                name="config:curseforge_api_key"
                id="config:curseforge_api_key"
                value="{{ $curseforge_api_key }}"
                placeholder=":eyes:"
                class="form-control"
              />

              <p class="text-muted small">
                The CurseForge API key used to retrieve modpacks from the service.
              </p>
            </div>

        </div>
      </div>
    </div>

  </div>
</form>
@endsection
