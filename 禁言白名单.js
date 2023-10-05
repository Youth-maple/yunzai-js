import plugin from'../../lib/plugins/plugin.js'
import{segment}from'oicq'
import cfg from'../../lib/config/config.js'
import common from'../../lib/common/common.js'
const list = [2737182976]//白名单账号
export class example extends plugin{
    constructor(){
        super({
            name: '禁言白名单',
            dsc: '顾名思义',
            event: 'notice.group.ban',
            priority: -5001,
            rule:[
                {
                    /** 命令正则匹配 */
                    fnc:'jiejin'
                },
                {
                    reg:'#增加白名单.*}',
                    fnc:'tj'
                }
        ]
        
        })
    }
    async jiejin(e){
        logger.info('[有人被禁言生效]')
        if(list.indexOf(e.user_id) > -1){
            e.reply('放开主人！')
            await common.sleep(1000)
            await e.group.muteMember(e.user_id,0)
        }else{return false}

    }
    
}