<script lang="ts">
  import {
    Button,
    closePopup,
    getCurrentLocation,
    Icon,
    IconArrowLeft,
    Label,
    ListView,
    navigate,
    Scroller
  } from '@hcengineering/ui'
  import setting, { settingId } from '@hcengineering/setting'
  import view, { Action, ActionCategory } from '@hcengineering/view'
  import { getClient } from '@hcengineering/presentation'
  import RightArrowIcon from './icons/Collapsed.svelte'
  import KeyboardIcon from './icons/Keyboard.svelte'
  import DocumentationIcon from './icons/Documentation.svelte'
  import workbench from '../plugin'

  let shortcuts = false
  let actions: Action[] = []
  let categories: ActionCategory[] = []

  const client = getClient()

  function navigateToSettings () {
    closePopup()
    const loc = getCurrentLocation()
    loc.path[2] = loc.path[3] = settingId
    loc.path.length = 4
    navigate(loc)
  }

  function formatKey (key: string): string[][] {
    const thens = key.split('->')
    const result: string[][] = []
    for (const r of thens) {
      result.push(
        r.split('+').map((it) =>
          it
            .replaceAll('key', '')
            .replaceAll(/Meta|meta/g, '⌘')
            .replaceAll('ArrowUp', '↑')
            .replaceAll('ArrowDown', '↓')
            .replaceAll('ArrowLeft', '←')
            .replaceAll('ArrowRight', '→')
            .replaceAll('Backspace', '⌫')
        )
      )
    }
    return result
  }

  async function getActions () {
    categories = await getClient().findAll(view.class.ActionCategory, [])
    const rawActions = await client.findAll(view.class.Action, [])

    const openAction = rawActions.find(
      (action) => action.label === 'view:string:Open' && action.category === 'view:category:General'
    )
    const deleteAction = rawActions.find(
      (action) => action.label === 'view:string:Delete' && action.category === 'view:category:General'
    )

    actions = rawActions.filter(
      (action) =>
        action.keyBinding &&
        action.keyBinding.length !== 0 &&
        action.label !== 'view:string:Open' &&
        action.label !== 'view:string:Delete'
    )

    deleteAction && actions.unshift(deleteAction)
    openAction && actions.unshift(openAction)

    actions.sort((a, b) => a.category.localeCompare(b.category))
  }
  $: getActions()

  const cards = [
    {
      icon: DocumentationIcon,
      title: workbench.string.Documentation,
      description: workbench.string.OpenPlatformGuide,
      disabled: true
    },
    {
      icon: view.icon.Setting,
      title: setting.string.Settings,
      description: workbench.string.AccessWorkspaceSettings,
      onClick: navigateToSettings
    },
    {
      icon: KeyboardIcon,
      title: workbench.string.KeyboardShortcuts,
      description: workbench.string.HowToWorkFaster,
      onClick: () => {
        shortcuts = true
      }
    }
  ]
</script>

<div class="helpAndSupportPopup">
  <div class="header">
    {#if shortcuts}
      <div class="mr-4 cursor-pointer" on:click={() => (shortcuts = !shortcuts)}>
        <Icon icon={IconArrowLeft} size={'medium'} fill={'var(--content-color)'} />
      </div>
    {/if}
    <span class="fs-title overflow-label">
      <Label label={shortcuts ? workbench.string.KeyboardShortcuts : workbench.string.HelpCenter} />
    </span>
  </div>
  {#if !shortcuts}
    {#each cards as card}
      <div class="clear-mins card {!card.disabled ? 'cursor-pointer focused-button' : ''}">
        <div class="container" on:click={card.onClick}>
          <Icon icon={card.icon} size={'small'} fill={'var(--content-color)'} />
          <div class="content">
            <div class="fs-title">
              <Label label={card.title} />
            </div>
            <div class="text-sm content-dark-color"><Label label={card.description} /></div>
          </div>
          <div class="rightIcon">
            <Icon icon={RightArrowIcon} size={'small'} />
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <!-- Keyboard shortcuts -->
    <Scroller>
      <ListView count={actions.length}>
        <svelte:fragment slot="category" let:item>
          {@const action = actions[item]}
          {#if item === 0 || (item > 0 && actions[item - 1].category !== action.category)}
            {#if action.category}
              {@const category = categories.find((cat) => cat._id === action.category)}
              {#if category?.label && category.label !== categories.find((cat) => cat._id === actions[item - 1]?.category)?.label}
                <div class="category-box">
                  <Label label={category.label} />
                </div>
              {/if}
            {/if}
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="item" let:item>
          {@const action = actions[item]}
          <div class="flex-row-center flex-between flex-grow ml-2 p-3 text-base">
            <div class="mr-4">
              <Icon icon={action.icon ?? IconArrowLeft} size={'small'} />
            </div>
            <div class="flex-grow">
              <Label label={action.label} />
            </div>
            <div class="mr-2 text-md flex-row-center">
              {#if action.keyBinding}
                {#each action.keyBinding as key, i}
                  {#if i !== 0}
                    <div class="ml-2 mr-2">or</div>
                  {/if}
                  <div class="flex-row-center">
                    {#each formatKey(key) as k, jj}
                      {#if jj !== 0}
                        <div class="ml-1 mr-1">then</div>
                      {/if}
                      {#each k as kk, j}
                        <div class="flex-center text-sm key-box">
                          {kk}
                        </div>
                      {/each}
                    {/each}
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </svelte:fragment>
      </ListView>
    </Scroller>
  {/if}
  <div class="footer">
    <Button
      id="contact-us"
      icon={setting.icon.Support}
      kind={'transparent'}
      disabled={true}
      label={workbench.string.ContactUs}
    />
  </div>
</div>

<style lang="scss">
  .card {
    border: 1px solid var(--theme-bg-accent-color);
    border-radius: 0.75rem;
    margin: 16px 1rem 0 1rem;
  }
  .container {
    display: flex;
    flex-direction: row;
    padding: 16px;
    width: 100%;
  }
  .content {
    padding: 0 10px;
    width: 100%;
  }
  .rightIcon {
    align-self: center;
  }
  .footer {
    align-items: flex-end;
    border-top: 1px solid var(--popup-divider);
    display: flex;
    flex: 1;
    justify-content: flex-end;
    margin: 0 16px;
    padding-top: 10px;
  }
  .key-box {
    background-color: var(--button-bg-color);
    color: var(--caption-color);
    min-width: 1.5rem;
    padding: 0 0.5rem;
    border: 1px solid var(--button-border-color);
    border-radius: 0.25rem;
  }
  .key-box + .key-box {
    margin-left: 0.5rem;
  }
  .category-box {
    display: inline-block;
    background-color: var(--divider-color);
    color: var(--caption-color);
    padding: 0.5rem;
  }
</style>