<?php

namespace Pterodactyl\Console\Commands\BlueprintFramework\Extensions\Modpackinstaller;

use Illuminate\Console\Command;
use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Console\BlueprintConsoleLibrary as BlueprintExtensionLibrary;

class ModpackinstallerYlirltpfevCommand extends Command
{
  protected $signature = 'modpackinstaller:install';
  protected $description = 'Import the egg';

  public function __construct(
    private BlueprintExtensionLibrary $blueprint,
  ) { parent::__construct(); }

  public function handle()
  {
    $blueprint = $this->blueprint;
    require base_path().'/.blueprint/extensions/modpackinstaller/console/functions/install.php';
  }
}
