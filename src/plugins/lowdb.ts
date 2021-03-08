import FileSync from 'lowdb/adapters/FileSync'
import Datastore from 'lowdb'

import { remote } from 'electron'
// import LodashId from 'lodash-id'
import path from 'path'

const userDataPath = remote.app.getPath('userData')
const adapter = new FileSync(path.join(userDataPath, 'banks-management-system.json'))
const db = Datastore(adapter)
// 引入 lodash_id: 唯一 id 插件
// db._.mixin(LodashId)

db.defaults({ banks: [] }).write()

export default db
