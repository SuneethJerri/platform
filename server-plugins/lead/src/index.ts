//
// Copyright © 2022 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { Doc } from '@anticrm/core'
import type { Plugin, Resource } from '@anticrm/platform'
import { plugin } from '@anticrm/platform'
import { TriggerFunc } from '@anticrm/server-core'

/**
 * @public
 */
export const serverLeadId = 'server-lead' as Plugin

/**
 * @public
 */
export default plugin(serverLeadId, {
  function: {
    LeadHTMLPresenter: '' as Resource<(doc: Doc) => string>,
    LeadTextPresenter: '' as Resource<(doc: Doc) => string>
  },
  trigger: {
    OnLeadUpdate: '' as Resource<TriggerFunc>
  }
})
