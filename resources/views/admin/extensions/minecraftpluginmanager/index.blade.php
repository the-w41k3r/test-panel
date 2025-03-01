@extends('layouts.admin')
<?php 
    // Define extension information.
    $EXTENSION_ID = "minecraftpluginmanager";
    $EXTENSION_NAME = stripslashes("Minecraft Plugin Manager");
    $EXTENSION_VERSION = "1.2.1";
    $EXTENSION_DESCRIPTION = stripslashes("Manage Minecraft plugins and install new ones in one click!");
    $EXTENSION_ICON = "/assets/extensions/minecraftpluginmanager/icon.png";
    $EXTENSION_WEBSITE = "https://www.sourcexchange.net/products/minecraft-plugin-manager-for-blueprint";
    $EXTENSION_WEBICON = "bx bx-store";
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
                The CurseForge API key used to retrieve plugins from the service.
                You can get one from the <a href="https://console.curseforge.com">CurseForge console</a>.
              </p>
            </div>

        </div>
      </div>
    </div>

  </div>
</form>
@endsection
