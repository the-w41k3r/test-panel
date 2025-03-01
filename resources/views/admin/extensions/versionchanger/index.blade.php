@extends('layouts.admin')
<?php 
    // Define extension information.
    $EXTENSION_ID = "versionchanger";
    $EXTENSION_NAME = stripslashes("Version Changer");
    $EXTENSION_VERSION = "1.0.1";
    $EXTENSION_DESCRIPTION = stripslashes("Version Changer allows you to adjust your minecraft servers version instantly.");
    $EXTENSION_ICON = "/assets/extensions/versionchanger/icon.jpg";
    $EXTENSION_WEBSITE = "https://www.sourcexchange.net/products/version-changer";
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
    @yield('extension.description')<div class="box box-info">
  <div class="box-header with-border">
    <h3 class="box-title">Information</h3>
  </div>
  <div class="box-body">
    <p>
      This extension is called <b>Version Changer</b>. <br>
      <code>versionchanger</code> is the identifier of this extension. <br>
      The current version is <i>1.0.1</i>. <br>
    </p>

		<img src="/extensions/versionchanger/versionchanger_banner.jpg" width="100%" style="max-width: 600px;" class="img-rounded" alt="banner">
  </div>
</div>
@endsection
