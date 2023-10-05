import plugin from '../../lib/plugins/plugin.js'
import common from'../../lib/common/common.js'
export class example extends plugin{
  constructor(){
    super({
      name:'假装退群',
      dsc:'好玩',
      event:'message',
      priority: 5500,
      rule:[{
        reg: '^（退群了|有缘再见）',
        fnc: 'tq'
      }]
    })
  }
  async tq(e){
    let qq = e.user_id
    let id = this.e.member.card || this.e.member.nickname
    await common.sleep(5000);
    e.reply(id + '(' + qq +')'+ '离开了我们')
  }
}
