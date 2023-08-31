import plugin from '../../lib/plugins/plugin.js';
import fetch from "node-fetch";
import { segment } from 'oicq';
import fs from 'fs';

//应该是定义规则
export class example extends plugin{
    constructor() {
        super({
            name: '[随机图库]发送图片',
            dsc: '发送随机图片',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#*(随机|来一张).*',
                    fnc: 'sendImage'
                }
            ]
        })
    }
    async sendImage(e) {
        const path = process.cwd() + '/resources/tuku'
        let msg = this.e.msg
        const reg = msg.replace(/#|随机|来一张/g, '').trim()
        let name = reg
        const role = name
        if (!role) return false
        let result = fs.existsSync(`${path}/${role}/`)
        if (result === true) {
            const files = fs.readdirSync(`${path}/${role}`)
            const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
            const randomIndex = Math.floor(Math.random() * imageFiles.length);
            const imagePath = `${path}/${role}/${imageFiles[randomIndex]}`;
        const img = fs.readFileSync(imagePath);
        await this.reply(segment.image(img));
        } 
    }
}

