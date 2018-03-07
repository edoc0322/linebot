const linebot = require('../index.js');
var getJSON = require('../node_modules/get-json/index.js');

//var request = require('../node_modules/request/index.js');
//var cheerio = request('../node_modules/cheerio/index.js');


const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    verify: true // default=true
});

bot.on('message', function (event) {
    switch (event.message.type) {
        case 'text':
            switch (event.message.text) {
                case 'Me':
                    event.source.profile().then(function (profile) {
                        return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
                    });
                    break;
                case 'Group':
                    return event.reply(event.source.groupId);
                    break;
                case 'Member':
                    event.source.member().then(function (member) {
                        return event.reply(JSON.stringify(member));
                    });
                    break;
                case 'Picture':
                    event.reply({
                        type: 'image',
                        originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
                        previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
                    });
                    break;
                case 'Location':
                    event.reply({
                        type: 'location',
                        title: 'LINE Plus Corporation',
                        address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
                        latitude: 13.7202068,
                        longitude: 100.5298698
                    });
                    break;
                case 'Push':
                    bot.push('U17448c796a01b715d293c34810985a4c', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
                    break;
                case 'Push2':
                    bot.push('Cba71ba25dafbd6a1472c655fe22979e2', 'Push to group');
                    break;
                case 'Multicast':
                    bot.push(['U17448c796a01b715d293c34810985a4c', 'Cba71ba25dafbd6a1472c655fe22979e2'], 'Multicast!');
                    break;
                case 'Confirm':
                    event.reply({
                        type: 'template',
                        altText: 'this is a confirm template',
                        template: {
                            type: 'confirm',
                            text: 'Are you sure?',
                            actions: [{
                                type: 'message',
                                label: 'Yes',
                                text: 'yes'
                            }, {
                                type: 'message',
                                label: 'No',
                                text: 'no'
                            }]
                        }
                    });
                    break;
                case 'Multiple':
                    return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
                    break;
                case 'Version':
                    event.reply('linebot@' + require('../package.json').version);
                    break;
                default:
                    if (event.message.text.toString().indexOf('測試') > -1) {
                        event.source.profile().then(function (profile) {
                            if (profile.displayName == '吳蔡宏') {
                                return event.reply('Hello ' + profile.displayName + ' 你剛剛說  ' + event.message.text.toString() + ' 嗎？');
                            }
                        });
                    }
                    else if(event.message.text.toString().indexOf('空氣')> -1)
                    {
                        var AllSite ='';
                        var str = '';
                        getJSON('http://opendata2.epa.gov.tw/AQI.json', function (error, response) {
                            response.forEach(function (e, i) {  
                                if(event.message.text.toString().indexOf(e.SiteName.toString()) > -1)
                                {
                                    str+=e.County +' 的 ' +  e.SiteName +'\n空氣品質指標(AQI)\n' ;
                                    str+='狀態:'+e['Status'] +'\n空汙指標:'+e['Pollutant']+'\n';
                                    str+='資料最後更新時間:\n'+e['PublishTime'].toString()+'\n';
                                    str+='======================'+'\n';
                                    str+='一氧化碳(CO)     :'+e['CO']+' ppm\n';
                                    str+='一氧化碳(8h平均) :'+e['CO_8hr']+' ppm\n';
                                    str+='臭氧(O3)         :'+e['O3'] +' ppb\n';
                                    str+='臭氧(O3)(8h平均) :'+e['O3_8hr']+' ppb\n';
                                    str+='一氧化氮(NO)     :'+e['NO']+' ppb\n';
                                    str+='二氧化氮(NO2)    :'+e['NO2']+' ppb\n';
                                    str+='氮氧化物(NOx)    :'+e['NOx']+' ppb\n';
                                    str+='二氧化硫(SO2)    :'+e['SO2']+' ppb\n';
                                    str+='懸浮微粒(PM10)   :'+e['PM10']+' ug/m3\n';
                                    str+='懸浮微粒(平均)   :'+e['PM10_AVG']+' ug/m3\n';
                                    str+='細懸浮微粒(PM2.5):'+e['PM2.5']+' ug/m3\n';
                                    str+='細懸浮微粒(平均) :'+e['PM2.5_AVG']+' ug/m3\n';
                                    str+='風向            :'+e['WindDirec']+'\n';
                                    str+='風速            :'+e['WindSpeed']+' m/sec\n';
                                }
                                else
                                {
                                  AllSite+='['+i.toString()+'] '+e.County +' 的 ' +  e.SiteName+'\n';
                                }
                            });
                            if(str=='')
                              return event.reply('找不到你搜尋的地點耶，你只能搜尋以下地區\n'+AllSite);
                            else
                              return event.reply(str);

                        });
                        //return event.reply(str);
                    }
                    else if(event.message.text.toString().indexOf('匯率')>-1)
                    {
			    return event.reply('母湯喔');
                    }
                    break;
            }
            break;
        case 'image':
            event.source.profile().then(function (profile) {
                event.message.content().then(function (data) {
                    const s = data.toString('hex').substring(0, 32);
                    return event.reply('哇!快來看 ' + profile.displayName + ' 上傳了好棒的照片耶~');
                }).catch(function (err) {
                    return event.reply(err.toString());
                });
            });
            break;
        case 'video':
            event.source.profile().then(function (profile) {
                return event.reply('哇!快來看 ' + profile.displayName + ' 上傳了好棒的影片耶~');
            });
            break;
        case 'audio':
            event.reply('Nice audio!');
            break;
        case 'location':
            event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
            break;
        case 'sticker':
            /*event.reply({
              type: 'sticker',
              packageId: 1,
              stickerId: 1
            });*/
            break;
        default:
            event.reply('Unknow message: ' + JSON.stringify(event));
            break;
    }
});

bot.on('follow', function (event) {
    event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
    event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
    event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
    event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
    event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
    event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/linewebhook', process.env.PORT || 80, function () {
    console.log('LineBot is running.');
});
