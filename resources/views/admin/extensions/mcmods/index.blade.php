@extends('layouts.admin')
<?php 
    // Define extension information.
    $EXTENSION_ID = "mcmods";
    $EXTENSION_NAME = stripslashes("MC Mods");
    $EXTENSION_VERSION = "1.0";
    $EXTENSION_DESCRIPTION = stripslashes("Install and Manage Minecraft Mods with ease.");
    $EXTENSION_ICON = "/assets/extensions/mcmods/icon.png";
    $EXTENSION_WEBSITE = "https://discord.com/invite/sQjuWcDxBY";
    $EXTENSION_WEBICON = "bx bx-link-external";
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
    @yield('extension.description')@if (session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif
<div class="row">
    <div class="col-md-6">
        <div class="box box-success">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-info-circle"></i> Information</h3>
            </div>
            <div class="box-body">
                <p>
                    MC Mods Installer extension allows you to manage and install Minecraft Mods easily with just one click.
                </p>
                <p>
                    Developed with <i class="fa fa-heart" style="color: #FB0000"></i> by <strong>StellarStudios</strong>.
                </p>
                <p>
                    Need help? Reach us on <a href="https://discord.gg/sQjuWcDxBY" target="_blank">Discord</a>.
                </p>
            </div>
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <td>Identifier</td>
                            <td><code>mcmods</code></td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td><code>v1.0</code></td>
                        </tr>
                        <tr>
                            <td>Author</td>
                            <td><code>sarthak77</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="box box-info">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-cog"></i> Configuration</h3>
            </div>
            <div class="box-body">
                <p>
                    Configure which Pterodactyl Eggs MC Mods should work on.
                </p>
                <button class="btn btn-gray-alt" 
                        style="padding: 5px 10px; margin-top: 10px;" 
                        data-toggle="modal" 
                        data-target="#extensionConfigModal">
                    Configure
                </button>
            </div>
        </div>

        <div class="box box-info">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-key"></i> API Key Configuration</h3>
            </div>
            <form action="{{ route('admin.extensions.mcmods.patch') }}" method="POST">
                @csrf
                @method('PATCH')
                <div class="box-body">
                    <div class="form-group">
                        <label for="curseforge_api_key">CurseForge API Key</label>
                        <input type="text" class="form-control" id="curseforge_api_key" name="curseforge_api_key" value="{{ old('curseforge_api_key', $curseForgeApiKey) }}" required placeholder="Enter your CurseForge API key">
                    </div>
                </div>
                <div class="box-footer">
                    <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i> Update API Key</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
