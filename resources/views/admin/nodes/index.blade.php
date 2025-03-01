@extends('layouts.admin')

@section('title')
    List Nodes
@endsection

@section('scripts')
    @parent
    {!! Theme::css('vendor/fontawesome/animation.min.css') !!}
@endsection

@section('content-header')
    @php
        $totalNodes = $nodes->count(); // Count total nodes
    @endphp
    <h1>Nodes<small>All nodes available on the system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Nodes</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Total: {{ $totalNodes }} Nodes</h3> <!-- Display total nodes here -->
                <div class="box-tools search01">
                    <form action="{{ route('admin.nodes') }}" method="GET">
                        <div class="input-group input-group-sm">
                            <input type="text" name="filter[name]" class="form-control pull-right" value="{{ request()->input('filter.name') }}" placeholder="Search Nodes">
                            <div class="input-group-btn">
                                <button type="submit" class="btn btn-default"><i class="fa fa-search"></i></button>
                                <a href="{{ route('admin.nodes.new') }}"><button type="button" class="btn btn-sm btn-primary" style="border-radius: 0 3px 3px 0;margin-left:-1px;">Create New</button></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <!-- <thead>
                        <tr>
                            <th style="width: 100px;">Name</th>
                            <th style="width: 5px;">Status</th>
                            <th class="text-center" style="width: 300px;">Memory</th>
                            <th class="text-center" style="width: 300px;">Disk</th>
                            <th class="text-center" style="width: 100px;">Servers</th>
                            <th class="text-center" style="width: 200px;">SSL</th>
                            <th class="text-center" style="width: 200px;">Public</th>
                        </tr>
                    </thead> -->
                    <tbody>
                        @php
                            $totalSerial = 1; // Initialize total serial number
                        @endphp
                        @foreach ($nodes->groupBy('location.short')->sortKeys() as $location => $locationNodes)
                            @php
                                $locationSerial = 1; // Initialize serial number for the location
                            @endphp
                            <!-- Table heading for each location -->
                            <tr style="background-color: #273340;">
                                <th style="width: 100px; font-weight: bold; color: white; font-size: 1.5rem; padding-left: 10px;">{{ $location }}</th>
                                <th class="text-center" style="width: 5px;">Status</th>
                                <th class="text-center" style="width: 300px;">Memory</th>
                                <th class="text-center" style="width: 300px;">Disk</th>
                                <th class="text-center" style="width: 100px;">Servers</th>
                                <th class="text-center" style="width: 200px;">SSL</th>
                                <th class="text-center" style="width: 200px;">Public</th>
                            </tr>
                            @foreach ($locationNodes as $node)
                                <tr>
                                    <td>
                                        <span style="color: #999999">{{ $locationSerial++ }}. </span><a href="{{ route('admin.nodes.view', $node->id) }}" style="font-size: 1.5rem;"> {{ $node->name }}</a>
                                    </td>
                                    <td class="text-center text-muted left-icon" data-action="ping" data-secret="{{ $node->getDecryptedKey() }}" data-location="{{ $node->scheme }}://{{ $node->fqdn }}:{{ $node->daemonListen }}/api/system">
                                        <i class="fa fa-fw fa-refresh fa-spin"></i>
                                    </td>
                                    {{-- Memory --}}
                                    <td class="text-center">
                                        @php
                                            $memoryRatio = $node->allocated_memory / ($node->memory * (1 + $node->memory_overallocate / 100));
                                            $memoryClass = $memoryRatio < 0.75 ? 'label-success' : ($memoryRatio < 0.85 ? 'label-warning' : 'label-danger');
                                        @endphp
                                        <span class="label {{ $memoryClass }}" style="font-size: 1.5rem;">
                                            {{ number_format($node->allocated_memory / 1024, 2) }} / 
                                            {{ number_format(($node->memory * (1 + $node->memory_overallocate / 100)) / 1024, 2) }} GB
                                        </span>
                                    </td>

                                    {{-- Disk --}}
                                    <td class="text-center">
                                        @php
                                            $diskRatio = $node->allocated_disk / ($node->disk * (1 + $node->disk_overallocate / 100));
                                            $diskClass = $diskRatio < 0.75 ? 'label-success' : ($diskRatio < 0.85 ? 'label-warning' : 'label-danger');
                                        @endphp
                                        <span class="label {{ $diskClass }}" style="font-size: 1.5rem;">
                                            {{ number_format($node->allocated_disk / 1024, 2) }} / 
                                            {{ number_format(($node->disk * (1 + $node->disk_overallocate / 100)) / 1024, 2) }} GB
                                        </span>
                                    </td>

                                    <td class="text-center">{{ $node->servers_count }}</td>
                                    <td class="text-center" style="color:{{ $node->scheme === 'https' ? '#50af51' : '#d9534f' }}">
                                        <i class="fa fa-{{ $node->scheme === 'https' ? 'lock' : 'unlock' }}"></i>
                                    </td>
                                    <td class="text-center">
                                        <i class="fa fa-{{ $node->public ? 'eye' : 'eye-slash' }}"></i>
                                    </td>

                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                </table>
            </div>
            @if($nodes->hasPages())
                <div class="box-footer with-border">
                    <div class="col-md-12 text-center">{!! $nodes->appends(['query' => Request::input('query')])->render() !!}</div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
    (function pingNodes() {
        $('td[data-action="ping"]').each(function(i, element) {
            $.ajax({
                type: 'GET',
                url: $(element).data('location'),
                headers: {
                    'Authorization': 'Bearer ' + $(element).data('secret'),
                },
                timeout: 5000
            }).done(function (data) {
                $(element).find('i').tooltip({
                    title: 'v' + data.version,
                });
                $(element).removeClass('text-muted').find('i').removeClass().addClass('fa fa-fw fa-heartbeat faa-pulse animated').css('color', '#50af51');
            }).fail(function (error) {
                var errorText = 'Error connecting to node! Check browser console for details.';
                try {
                    errorText = error.responseJSON.errors[0].detail || errorText;
                } catch (ex) {}

                $(element).removeClass('text-muted').find('i').removeClass().addClass('fa fa-fw fa-heart-o').css('color', '#d9534f');
                $(element).find('i').tooltip({ title: errorText });
            });
        }).promise().done(function () {
            setTimeout(pingNodes, 10000);
        });
    })();
    </script>
@endsection
