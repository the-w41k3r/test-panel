<?php

namespace Pterodactyl\Http\Controllers\Admin\Extensions\minecraftpluginmanager;

use Illuminate\View\View;
use Illuminate\View\Factory as ViewFactory;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Admin\AdminFormRequest;
use Illuminate\Http\RedirectResponse;

use Pterodactyl\BlueprintFramework\Libraries\ExtensionLibrary\Admin\BlueprintAdminLibrary as BlueprintExtensionLibrary;

class minecraftpluginmanagerExtensionController extends Controller
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
    $curseforge_api_key = $this->blueprint->dbGet('minecraftpluginmanager', 'config:curseforge_api_key');

    return $this->view->make(
      'admin.extensions.minecraftpluginmanager.index', [
        'curseforge_api_key' => $curseforge_api_key,

        'root' => "/admin/extensions/minecraftpluginmanager",
        'blueprint' => $this->blueprint,
      ]
    );
  }
  /**
   * @throws \Pterodactyl\Exceptions\Model\DataValidationException
   * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
   */
  public function update(minecraftpluginmanagerSettingsFormRequest $request): RedirectResponse
  {
    foreach ($request->normalize() as $key => $value) {
      $this->settings->set('minecraftpluginmanager::' . $key, $value);
    }

    return redirect()->route('admin.extensions.minecraftpluginmanager.index');
  }
}
class minecraftpluginmanagerSettingsFormRequest extends AdminFormRequest
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
