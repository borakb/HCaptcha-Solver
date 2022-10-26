const fs = require("fs");
const request = require("request");

const checkImg = require("./modules/checkImg");

var checkConfigHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-type': 'application/x-www-form-urlencoded',
    'Origin': 'https://newassets.hcaptcha.com',
    'Alt-Used': 'hcaptcha.com',
    'Connection': 'keep-alive',
    'Referer': 'https://newassets.hcaptcha.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'TE': 'trailers',

}

let labels = fs.readFileSync("./lib/labels.txt", "utf-8");
labels = labels.split("\n");

// function randomFromRange(start, end) {
//     return Math.round(Math.random() * (end - start) + start);
// }

// function getMouseMovements(timestamp) {

//     let lastMovement = timestamp;
//     const motionCount = randomFromRange(1000, 10000);
//     const mouseMovements = [];
//     for (let i = 0; i < motionCount; i++) {
//         lastMovement += randomFromRange(0, 10);
//         mouseMovements.push([randomFromRange(0, 500), randomFromRange(0, 500), lastMovement]);
//     }
//     return mouseMovements;

// }

const checkConfig = async (domain, sitekey) => {

    return new Promise((resolve) => {
        request({
            "method": "GET",
            "url":  `https://hcaptcha.com/checksiteconfig?v=1f7dc62&host=${domain}&sitekey=${sitekey}&sc=1&swa=1`,
            "headers": checkConfigHeaders,
            "gzip": "true"
        }, async function (error, response) {
            if (error) return resolve(null);
            const body = JSON.parse(response.body);
    
            if(body && body.pass == true && body.c) {
                return resolve(body.c);
            }

            return resolve(null);
        }); 
    });

}

const getCaptcha = async (nData, cData, domain, sitekey) => {

    return new Promise((resolve) => {
        const opts = {
            'method': 'POST',
            'url': `https://hcaptcha.com/getcaptcha/${sitekey}`,
            'headers': {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Content-type': 'application/x-www-form-urlencoded',
              'Origin': 'https://newassets.hcaptcha.com',
              'Alt-Used': 'hcaptcha.com',
              'Connection': 'keep-alive',
              'Referer': 'https://newassets.hcaptcha.com/',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-site',
              'TE': 'trailers',

            },
            form: {
              'v': '1f7dc62',
              'sitekey': sitekey,
              'host': domain,
              'hl': 'en',
              'motionData': '{"st":1651875329126,"mm":[[45,75,1651875330783],[43,54,1651875330866]],"mm-mp":29.666666666666668,"md":[[43,53,1651875330885]],"md-mp":0,"mu":[[43,53,1651875330962]],"mu-mp":0,"v":1,"topLevel":{"inv":false,"st":1651875328727,"sc":{"availWidth":1920,"availHeight":1040,"width":1920,"height":1080,"colorDepth":24,"pixelDepth":24,"top":0,"left":0,"availTop":0,"availLeft":0,"mozOrientation":"landscape-primary","onmozorientationchange":null},"nv":{"permissions":{},"pdfViewerEnabled":true,"doNotTrack":"unspecified","maxTouchPoints":0,"mediaCapabilities":{},"oscpu":"Windows NT 10.0; Win64; x64","vendor":"","vendorSub":"","productSub":"20100101","cookieEnabled":true,"buildID":"20181001000000","mediaDevices":{},"serviceWorker":{},"credentials":{},"clipboard":{},"mediaSession":{},"webdriver":false,"hardwareConcurrency":8,"geolocation":{},"appCodeName":"Mozilla","appName":"Netscape","appVersion":"5.0 (Windows)","platform":"Win32","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0","product":"Gecko","language":"en-US","languages":["en-US","en"],"locks":{},"onLine":true,"storage":{},"plugins":["internal-pdf-viewer","internal-pdf-viewer","internal-pdf-viewer","internal-pdf-viewer","internal-pdf-viewer"]},"dr":"https://www.google.com/","exec":false,"wn":[[904,478,1,1651875328774]],"wn-mp":0,"xy":[[0,49,1,1651875328774],[0,49,1,1651875329065]],"xy-mp":291,"mm":[[181,494,1651875330553],[177,486,1651875330573],[171,473,1651875330595],[168,466,1651875330618],[166,460,1651875330636],[167,455,1651875330657],[171,445,1651875330678],[175,432,1651875330698],[178,419,1651875330719],[179,414,1651875330749],[180,407,1651875330768]],"mm-mp":7.03125},"session":[],"widgetList":["0xi0k89iezqc"],"widgetId":"0xi0k89iezqc","href":"https://democaptcha.com/demo-form-eng/hcaptcha.html","prev":{"escaped":false,"passed":false,"expiredChallenge":false,"expiredResponse":false}}',
              'n': nData,
              'c': JSON.stringify(cData)
            },
            "gzip": true
          };
        request(opts, async (error, response) => {
            if (error) return resolve(null);
            const body = JSON.parse(response.body);   
            if(body.tasklist && body.key) {
                return resolve(body);
            }
            return resolve(null);
        });
    });
};

const submitCaptcha = async(captcha_key, sitekey, domain, nData, cData, request_type, answers) => {
    return new Promise((resolve) => {
        request({
            "method": "POST",
            "url": `https://hcaptcha.com/checkcaptcha/${sitekey}/${captcha_key}`,
            "headers": {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-type': 'application/json;charset=UTF-8',
                'Origin': 'https://newassets.hcaptcha.com',
                'Alt-Used': 'hcaptcha.com',
                'Connection': 'keep-alive',
                'Referer': 'https://newassets.hcaptcha.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'TE': 'trailers',
            },
            body: JSON.stringify({
                "answers": answers,
                "c": JSON.stringify(cData),
                "job_mode": request_type,
                "motionData": "{\"st\":1660752621496,\"dct\":1660752621496,\"mm\":[[393,278,1660752621541],[399,379,1660752625105],[334,372,1660752625121],[288,359,1660752625138],[248,345,1660752625154],[208,326,1660752625170],[174,309,1660752625187],[150,292,1660752625203],[143,284,1660752625221],[143,280,1660752625241],[148,280,1660752625260],[149,280,1660752625449],[149,279,1660752625475],[145,278,1660752625491],[140,276,1660752625508],[133,273,1660752625527],[132,270,1660752625544],[131,267,1660752625561],[131,265,1660752625577],[132,260,1660752625593],[133,255,1660752625614],[134,251,1660752625634],[134,249,1660752625652],[135,246,1660752625670],[137,243,1660752625690],[138,242,1660752625706],[139,241,1660752625735],[140,241,1660752625890],[150,244,1660752625906],[168,250,1660752625923],[189,257,1660752625940],[199,263,1660752625956],[201,265,1660752625977],[201,268,1660752626001],[201,271,1660752626021],[202,275,1660752626037],[203,279,1660752626053],[204,282,1660752626071],[204,284,1660752626095],[204,283,1660752626223],[207,281,1660752626240],[212,278,1660752626258],[217,273,1660752626274],[223,267,1660752626292],[229,258,1660752626309],[236,249,1660752626325],[245,242,1660752626341],[256,234,1660752626357],[266,227,1660752626375],[277,221,1660752626391],[285,215,1660752626407],[292,211,1660752626424],[299,207,1660752626442],[304,205,1660752626458],[309,202,1660752626474],[312,201,1660752626491],[316,199,1660752626507],[319,197,1660752626525],[323,194,1660752626541],[325,191,1660752626557],[325,192,1660752626708],[326,197,1660752626725],[329,205,1660752626745],[330,212,1660752626763],[331,221,1660752626779],[331,230,1660752626796],[333,238,1660752626814],[334,246,1660752626830],[335,252,1660752626847],[338,260,1660752626863],[340,269,1660752626879],[341,277,1660752626896],[341,284,1660752626912],[341,290,1660752626928],[341,296,1660752626945],[339,300,1660752626968],[339,300,1660752627027],[338,302,1660752627044],[336,305,1660752627062],[333,312,1660752627079],[326,318,1660752627096],[315,326,1660752627112],[298,337,1660752627129],[279,346,1660752627145],[255,356,1660752627161],[228,364,1660752627177],[205,371,1660752627193],[180,375,1660752627209],[161,379,1660752627226],[150,382,1660752627242],[141,385,1660752627258],[134,387,1660752627279],[130,388,1660752627296],[127,390,1660752627312],[124,391,1660752627332],[121,392,1660752627349],[118,393,1660752627365],[114,394,1660752627382],[110,396,1660752627400],[107,399,1660752627416],[104,400,1660752627436],[102,402,1660752627454],[102,403,1660752627497],[102,405,1660752627515],[104,409,1660752627534],[108,413,1660752627550],[113,416,1660752627568],[118,420,1660752627584],[127,423,1660752627601],[135,427,1660752627617],[146,431,1660752627633],[159,436,1660752627649],[169,440,1660752627665],[178,443,1660752627681],[184,443,1660752627700],[187,445,1660752627720],[190,445,1660752627737],[194,447,1660752627755],[199,448,1660752627775],[202,449,1660752627792],[204,450,1660752627832],[207,451,1660752627848],[211,452,1660752627865],[216,453,1660752627881],[222,455,1660752627897],[227,455,1660752627920],[227,454,1660752628027],[228,452,1660752628044],[228,451,1660752628060],[228,452,1660752628333],[229,455,1660752628353],[232,460,1660752628369],[238,465,1660752628385],[244,468,1660752628401],[250,472,1660752628418],[257,478,1660752628434],[265,485,1660752628450],[272,489,1660752628467],[277,494,1660752628484],[281,497,1660752628500],[285,500,1660752628517],[288,503,1660752628535],[292,506,1660752628551],[295,509,1660752628567],[299,513,1660752628583],[303,515,1660752628599],[306,518,1660752628617],[308,519,1660752628633],[311,523,1660752628652],[315,526,1660752628670],[319,529,1660752628688],[324,531,1660752628708],[328,534,1660752628724],[332,537,1660752628742],[337,539,1660752628758],[343,542,1660752628774],[349,546,1660752628791],[356,549,1660752628807],[361,552,1660752628826],[363,554,1660752628848]],\"mm-mp\":6.467314487632506,\"md\":[[204,284,1660752626100],[325,191,1660752626565],[341,295,1660752626943],[228,451,1660752628190],[364,554,1660752628972]],\"md-mp\":718,\"mu\":[[204,284,1660752626180],[325,191,1660752626650],[339,300,1660752627020],[228,451,1660752628272],[364,554,1660752629093]],\"mu-mp\":728.25,\"topLevel\":{\"st\":1660752618233,\"sc\":{\"availWidth\":1920,\"availHeight\":1040,\"width\":1920,\"height\":1080,\"colorDepth\":24,\"pixelDepth\":24,\"availLeft\":0,\"availTop\":0,\"onchange\":null,\"isExtended\":false},\"nv\":{\"vendorSub\":\"\",\"productSub\":\"20030107\",\"vendor\":\"Google Inc.\",\"maxTouchPoints\":0,\"scheduling\":{},\"userActivation\":{},\"doNotTrack\":null,\"geolocation\":{},\"connection\":{},\"pdfViewerEnabled\":true,\"webkitTemporaryStorage\":{},\"webkitPersistentStorage\":{},\"hardwareConcurrency\":8,\"cookieEnabled\":true,\"appCodeName\":\"Mozilla\",\"appName\":\"Netscape\",\"appVersion\":\"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"platform\":\"Win32\",\"product\":\"Gecko\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"language\":\"en-US\",\"languages\":[\"en-US\"],\"onLine\":true,\"webdriver\":false,\"bluetooth\":{},\"clipboard\":{},\"credentials\":{},\"keyboard\":{},\"managed\":{},\"mediaDevices\":{},\"storage\":{},\"serviceWorker\":{},\"wakeLock\":{},\"deviceMemory\":8,\"ink\":{},\"hid\":{},\"locks\":{},\"mediaCapabilities\":{},\"mediaSession\":{},\"permissions\":{},\"presentation\":{},\"serial\":{},\"virtualKeyboard\":{},\"usb\":{},\"xr\":{},\"userAgentData\":{\"brands\":[{\"brand\":\".Not/A)Brand\",\"version\":\"99\"},{\"brand\":\"Google Chrome\",\"version\":\"103\"},{\"brand\":\"Chromium\",\"version\":\"103\"}],\"mobile\":false,\"platform\":\"Windows\"},\"plugins\":[\"internal-pdf-viewer\",\"internal-pdf-viewer\",\"internal-pdf-viewer\",\"internal-pdf-viewer\",\"internal-pdf-viewer\"]},\"dr\":\"\",\"inv\":false,\"exec\":false,\"wn\":[[1414,969,1,1660752618234],[1413,969,1,1660752619443],[1410,969,1,1660752619470],[1402,969,1,1660752619498],[1307,969,1,1660752619526],[1207,969,1,1660752619574],[1163,969,1,1660752619597],[1143,969,1,1660752619623],[1132,969,1,1660752619656],[1131,969,1,1660752619691],[1130,969,1,1660752619797],[1128,969,1,1660752619826],[1122,969,1,1660752619861],[1117,969,1,1660752619891],[1111,969,1,1660752619907],[1108,969,1,1660752619931],[1092,969,1,1660752619952],[1081,969,1,1660752619981],[1067,969,1,1660752619998],[1050,969,1,1660752620038],[997,969,1,1660752620063],[989,969,1,1660752620082],[959,969,1,1660752620110],[944,969,1,1660752620138],[939,969,1,1660752620164],[929,969,1,1660752620191],[924,969,1,1660752620225],[921,969,1,1660752620251],[920,969,1,1660752620274]],\"wn-mp\":68,\"xy\":[[0,0,1,1660752618235]],\"xy-mp\":0,\"mm\":[[919,322,1660752620400],[908,331,1660752620418],[888,349,1660752620435],[856,371,1660752620452],[806,403,1660752620468],[745,441,1660752620485],[685,475,1660752620501],[635,502,1660752620517],[593,519,1660752620536],[562,531,1660752620552],[529,536,1660752620570],[503,538,1660752620586],[480,538,1660752620602],[460,536,1660752620619],[434,531,1660752620635],[408,526,1660752620654],[385,522,1660752620670],[366,518,1660752620688],[346,515,1660752620704],[344,484,1660752621481],[380,484,1660752621497],[421,484,1660752621513],[462,483,1660752621529],[504,481,1660752621545],[546,480,1660752621561],[594,480,1660752621577],[642,480,1660752621593],[690,480,1660752621609],[736,480,1660752621625],[777,480,1660752621641],[817,480,1660752621657],[848,480,1660752621673],[874,480,1660752621689],[895,480,1660752621706],[913,481,1660752621722],[918,556,1660752625016],[839,569,1660752625033],[761,575,1660752625049],[680,579,1660752625065],[603,582,1660752625081],[530,583,1660752625097]],\"mm-mp\":8.04273504273505},\"v\":1}",
                "n": nData,
                "serverdomain": domain,
                "sitekey": sitekey,
                "v": "1f7dc62"
            }),
            "gzip": "true"
        }, function(error, response) {
            if(error) return resolve(null);

            //console.log(response.request)

            let body = JSON.parse(response.body);
            //console.log(body);

            if(body && body.pass && body.generated_pass_UUID) {
                return resolve(body.generated_pass_UUID);
            }

            resolve(null);
        });
    });
}

const solveTasks = async (taskList, objective) => {

    let solutions = {};

    for (const x of taskList) {
            
        await checkImg(x.datapoint_uri).then(classImg => {

            if(classImg && objective == classImg) {

                solutions[x.task_key] = 'true';

            } else {

                solutions[x.task_key] = 'false';

            }

        });

    };

    return solutions;
};

const solveCaptcha = async (domain, sitekey, Comms, attempt) => {

    if(attempt >= 3) return false;

    let token = null;
    let nCode = null;

    await checkConfig(domain, sitekey).then(l => token = l);
    await Comms.requestToken(token.req).then(l => nCode = l);

    if(!token) return false;

    let captchaData = null;

    await getCaptcha(nCode, token, domain, sitekey).then(l => captchaData = l);
    
    if(!captchaData) return false;

    const taskList = captchaData.tasklist;
    let question = captchaData.requester_question.en;

    // console.log(question);

    if(!taskList || !question) return false;

    let objective = null;

    if(question.includes("Please click each image containing an ")) {
        objective = question.slice(38);
    } else {
        objective = question.slice(37);
    }

    console.log(objective);

    if(!labels.includes(objective)) {
        let sol = await solveCaptcha(domain, sitekey, Comms, attempt+1);
        return sol;
    }

    let answers = null;
    await solveTasks(taskList, objective).then(l => answers = l);

    console.log(answers);
    console.log(taskList);

    let newNData = null;
    await Comms.requestToken(captchaData.c.req).then(l => newNData = l);

    const newCData = captchaData.c;

    let answer = null;
    await submitCaptcha(captchaData.key, sitekey, domain, newNData, newCData, captchaData.request_type, answers).then(l => answer = l);

    if(!answer) {
        let sol = await solveCaptcha(domain, sitekey, Comms, attempt+1);
        return answer;
    }

    return answer;
};

// solveCaptcha("democaptcha.com", "51829642-2cda-4b09-896c-594f89d700cc").then(l => {
//     console.log(l);
// });

module.exports = solveCaptcha;