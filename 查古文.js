import plugin from '../../lib/plugins/plugin.js';
import fetch from 'node-fetch';
import { pinyin } from 'pinyin-pro';
import https from 'https';
//使用前需要下载pinyin-pro库，npm install pinyin-pro
export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '查古文',
      /** 功能描述 */
      dsc: '做着玩',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 20,
      rule: [
        {
          /** 命令正则匹配 */
          reg:'^#*查古文.*',
          /** 执行方法 */
          fnc: 'poem'
        }
      ]
    })
  }
  async poem(e) {
    /** e.msg 用户的命令消息 */
    let msg = this.e.msg
    let name = msg.replace(/#查古文/g, '').trim()        
    const mes = pinyin(name,{ toneType: 'none'})
    let key = mes.replace(/\s/g,"")

    /** 古诗接口地址 */
    let url = 'https://open.saintic.com/api/sentence/' + key
    https.get(url,(response) =>{
      let data = ''
      response.on('data',(chunk) => {
        data += chunk    
    })
    response.on('end', () => {
      let json = JSON.parse(data) 
      let code = json.code
      if (code === 0){
      let author = json.data.author
      let name = json.data.name
      let sentence = json.data.sentence
      let pomes = sentence + '--' + author + '《' + name + '》'
      this.reply(pomes,false)} 
      else {this.reply('没有找到相关的古文哦',false)} 
            
    })
    })

  }
}
