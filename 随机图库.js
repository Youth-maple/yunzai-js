import plugin from '../../lib/plugins/plugin.js';
let source={}
import fetch from "node-fetch";
import { segment } from 'oicq';
import fs, { mkdir } from 'fs';
import co from '../../lib/common/common.js'
const path = process.cwd() + '/resources/tuku'
//图片都保存在resources下的tuku文件夹里，没有可以自行创建
//cv了枫叶随机图、无用插件等，感谢大佬们
//应该是定义规则
export class example extends plugin{
    constructor() {
        super({
            name: '[随机图库]发送图片',
            dsc: '发送随机图片',
            event: 'message',
            priority: 5,
            rule: [
                {
                    reg: '^#*(随机|来一张).*',
                    fnc: 'sendImage'               
                },
                {
                    reg: '^#*上传随机.*',
                    fnc: 'tj' , 
                },
                {
                    reg: '^#*创建图库.*',
                    fnc: 'cj' ,
                }    
            ]
        })
    }
    async sendImage(e) {
       
        let msg = this.e.msg
        const reg = msg.replace(/#|随机|来一张/g, '').trim()
        let name = reg
        const role = name       
        let result = fs.existsSync(`${path}/${role}/`)
        if (result === true) {
            const files = fs.readdirSync(`${path}/${role}`)
            const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
            const randomIndex = Math.floor(Math.random() * imageFiles.length);
            const imagePath = `${path}/${role}/${imageFiles[randomIndex]}`;
        const img = fs.readFileSync(imagePath);
        await this.reply(segment.image(img));
        } else{
        this.reply('没有找到相关的图片喵，要先创建图库' + role + '，然后上传图片喵',false)
        }
    }
    async tj(e){
        if(!e.isMaster) return e.reply('只有主人能上传!!!')
        if (e.isGroup) {
            source = (await e.group.getChatHistory(e.source ?.seq, 1)).pop()
          }else{
            source = (await e.friend.getChatHistory((e.source ?.time + 1), 1)).pop()
        }
        let imageMessages = []
        if (source) {
            for (let val of source.message) {
              if (val.type === 'image') {
                imageMessages.push(val.url)
              }else if (val.type === 'xml') {
               let resid = val.data.match(/m_resid="(.*?)"/)[1]
                if (!resid) break
                let message = await Bot.getForwardMsg(resid)
                for (const item of message) {
                  for (const i of item.message) {
                    if (i.type === 'image') {
                      imageMessages.push(i.url)
                    }
                  }
            }      
          }
        }
        }else{
          imageMessages = e.img
        }
        if (!imageMessages.length) return e.reply('没发现图片喵，请将要发送的图片与消息一同发送或者引用要添加的图像哦~')
        
        let msg = this.e.msg
        const reg = msg.replace(/#|上传|随机/g, '').trim()
        let name = reg
        const role = name 
        let result = fs.existsSync(`${path}/${role}/`) 
        if (result === true){
        try{
            let savePath 
            let File
            for (let i = 0; i < imageMessages.length; i++) {
                File = fs.readdirSync(`${path}/${role}`)
                savePath = `${path}/${role}/${File.length + 1}.jpg`
                await co.downFile(imageMessages[i], savePath)
              }
              e.reply(`添加图片${imageMessages.length}张成功`)
        } catch (err) {
            logger.error(err)
            e.reply('添加图片失败',false)
          }
         }else{this.reply('这是不存在的图库喵，要先创建图库' + role + '，然后上传图片喵',false)}       
        }
    async cj(e){
        let msg = this.e.msg
        const reg = msg.replace(/#|创建|图库/g, '').trim()
        let name = reg
        const role = name       
        let result = fs.existsSync(`${path}/${role}/`)
        if (result === true){
          this.reply('已经存在该图库了哦')
        }else{
          fs.mkdirSync(`${path}/${role}/`)
          this.reply('图库创建好啦！')
        }
 
    }    
  

    
}

