<?php

namespace Pterodactyl\Http\Controllers\Admin\Extensions\modpackinstaller;

use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;
use Illuminate\Http\RedirectResponse;

use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;

class modpackinstallerExtensionController extends Controller
{
  public function __construct(
    private ViewFactory $view,
    private BlueprintExtensionLibrary $blueprint,
    private ConfigRepository $config,
    private SettingsRepositoryInterface $settings,
  ) {}
  
  public function index(): View
  {
    // GET DATABASE VALUES
    $curseforge_api_key = $this->blueprint->dbGet('modpackinstaller', 'config:curseforge_api_key');

    return $this->view->make(
      'admin.extensions.modpackinstaller.index', [
        'curseforge_api_key' => $curseforge_api_key,

        'root' => "/admin/extensions/modpackinstaller",
        'blueprint' => $this->blueprint,
      ]
    );
  }
  /**
   * @throws \Pterodactyl\Exceptions\Model\DataValidationException
   * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
   */
  public function update(modpackinstallerSettingsFormRequest $request): RedirectResponse
  {
    foreach ($request->normalize() as $key => $value) {
      $this->settings->set('modpackinstaller::' . $key, $value);
    }

    return redirect()->route('admin.extensions.modpackinstaller.index');
  }
}
class modpackinstallerSettingsFormRequest extends AdminFormRequest
{
  public function rules(): array
  {
    return [
      'config:curseforge_api_key' => 'string',
    ];
  }

  public function attributes(): array
  {
    return [
      'config:curseforge_api_key' => 'CurseForge API Key',
    ];
  }
}
